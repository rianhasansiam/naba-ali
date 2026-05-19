
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import clientPromise from "./mongodb"   // ← reuse singleton, no second MongoClient
import { connectToDatabase } from "./mongodb"
import { createOrUpdateUser } from "./userUtils"
import bcryptjs from "bcryptjs"

export const { handlers, signIn, signOut, auth } = NextAuth({

  adapter: MongoDBAdapter(clientPromise),
  
  providers: [
    // Google OAuth Provider
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        }
      }
    }),
    
    // Email/Password Credentials Provider
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Email and password are required")
          }

        const { database } = await connectToDatabase()
        const user = await database.collection("users").findOne({ 
            email: credentials.email.toLowerCase() 
          })

          if (!user) {
            throw new Error("No user found with this email address")
          }

          // Check if user has a password (might be a Google OAuth user)
          if (!user.password) {
            throw new Error("Please use Google Sign-In for this account")
          }

          const isPasswordValid = await bcryptjs.compare(
            credentials.password, 
            user.password
          )

          if (!isPasswordValid) {
            throw new Error("Invalid password")
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            image: user.image,
            role: user.role || 'user'
          }
        } catch (error) {
          // Sanitize error message to prevent format string injection
          const errorMessage = String(error?.message || 'Unknown error').replace(/%/g, '%%')
          console.error("Auth error:", errorMessage)
          throw new Error(errorMessage)
        }
      }
    })
  ],

  callbacks: {
    async jwt({ token, user, account, profile }) {
      // Initial sign in - add user info to token
      if (user) {
        token.id = user.id
        token.role = user.role || 'user'
        token.provider = account?.provider || 'credentials'
        
        // For credentials provider, ensure user exists in database
        if (account?.provider === 'credentials' || !account) {
          try {
            const dbUser = await createOrUpdateUser(
              {
                email: user.email,
                name: user.name,
                image: user.image
              },
              'credentials'
            )
            token.id = dbUser.id
            token.role = dbUser.role
          } catch (error) {
            console.error('Error creating/updating user in JWT callback:', error)
          }
        }
      }
      
      // Handle Google OAuth in JWT as well
      if (account?.provider === 'google' && profile) {
        try {
          const profileData = {
            googleId: profile.sub,
            locale: profile.locale,
            picture: profile.picture,
            verified: profile.email_verified
          }
          
          const dbUser = await createOrUpdateUser(
            {
              email: token.email,
              name: token.name,
              image: token.picture
            },
            'google',
            profileData
          )
          
          token.id   = dbUser.id
          token.role = dbUser.role
          token.name  = dbUser.name  || token.name
          token.image = dbUser.image || token.picture
          token.provider = 'google'
          token.emailVerified = dbUser.emailVerified
        } catch (error) {
          console.error('Error handling Google OAuth in JWT callback:', error)
        }
      }
      
      return token
    },

    async session({ session, token, user }) {
      try {
        // Read from the already-populated JWT token — no extra DB call needed.
        if (token) {
          session.user.id             = token.id
          session.user.role           = token.role
          session.user.provider       = token.provider
          session.user.emailVerified  = token.emailVerified ?? null
          if (token.name)  session.user.name  = token.name
          if (token.image) session.user.image = token.image
        }
        // For database sessions (OAuth providers using adapter)
        else if (user) {
          session.user.id   = user.id
          session.user.role = user.role || 'user'
        }
        
        return session
      } catch (error) {
        console.error('Error in session callback:', error)
        return session
      }
    },

    async signIn({ user, account, profile }) {
      try {
        // Allow sign in for all providers
        // User creation/update is handled in JWT callback for better reliability

        return true
      } catch (error) {
        console.error('Error in signIn callback:', error)
        return false
      }
    }
  },

  pages: {
    signIn: '/login',
    signUp: '/signup',
    error: '/login'
  },

  session: {
    strategy: 'jwt', // Use JWT for better credentials provider support
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  secret: process.env.NEXTAUTH_SECRET,
})