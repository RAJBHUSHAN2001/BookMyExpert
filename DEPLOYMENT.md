# Deployment Guide: BookMyExpert

Follow these steps to deploy your full-stack application for free using **MongoDB Atlas** and **Render**.

## 1. Database: MongoDB Atlas (Cloud)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free account.
2. Create a new Cluster (Shared/Free).
3. Under **Network Access**, add `0.0.0.0/0` (Allows access from any IP, required for Render).
4. Under **Database Access**, create a user with a username and password.
5. Click **Connect** -> **Connect your application** and copy the **Connection String**.
   - It will look like: `mongodb+srv://<username>:<password>@cluster0.xxxx.mongodb.net/bookmyexpert?retryWrites=true&w=majority`

## 2. Prepare Your Repository
Ensure your code is pushed to a GitHub repository.

## 3. Deploy Backend: Render (Web Service)
1. Login to [Render](https://render.com/).
2. Click **New +** -> **Web Service**.
3. Connect your GitHub repository.
4. Set the following:
   - **Name**: `bookmyexpert-api`
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
5. Click **Advanced** and add **Environment Variables**:
   - `PORT`: `10000` (Render uses this by default)
   - `MONGO_URI`: *(Your MongoDB Atlas connection string)*
   - `CLIENT_URL`: *(Your Frontend URL - you'll get this in the next step)*
6. Click **Create Web Service**.

## 4. Deploy Frontend: Render (Static Site)
1. Click **New +** -> **Static Site**.
2. Connect the same GitHub repository.
3. Set the following:
   - **Name**: `bookmyexpert-client`
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
4. Click **Advanced** and add **Environment Variables**:
   - `VITE_API_URL`: `https://your-backend-url.onrender.com/api`
   - `VITE_SOCKET_URL`: `https://your-backend-url.onrender.com`
5. Click **Create Static Site**.

---

### ⚠️ Critical Sync Step
Once your Frontend is deployed, you will get a URL (e.g., `https://bookmyexpert-client.onrender.com`).
1. Go back to your **Backend** Web Service on Render.
2. Go to **Settings** -> **Environment Variables**.
3. Update `CLIENT_URL` with your new Frontend URL.
4. This ensures that Socket.io and CORS allow the connection.

### 🏁 Verify
Visit your Frontend URL, and you should see your experts! Note: You may need to run your `seed.js` script locally once pointed at the Atlas URI, or create a temporary script in the backend to seed the cloud database.
