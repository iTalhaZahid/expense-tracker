# 💰 Expense Tracker

A full-featured **Expense Tracker** built with **React Native**, **TypeScript**, **Firebase**, **Cloudinary**, and **react-native-gifted-charts**. It supports user authentication, wallet management, transaction tracking, image uploads, and interactive data visualization.

---

## 🚀 Features

- 🔐 User Authentication (Sign In / Sign Up)
- 💼 Wallet Management
- 📊 Transaction Tracking with Bar Chart Visualization
- ☁️ Image Upload using Cloudinary
- 🔍 Modal Interfaces 
- 📱 Responsive & Modular UI (Custom Atoms & Molecules)
- 🔗 Firebase Integration for Real-Time Data
- ♻️ Reusable Hooks & Scalable Services Architecture

---

## 📁 Folder Structure

```

expense-tracker/
├── config/                  # Firebase config
├── contexts/               # Context API (e.g. Auth)
├── services/               # Firebase & Cloudinary logic
│   ├── imgServices.tsx     # Cloudinary upload + fallback image logic
│   ├── transactionService.tsx
│   ├── userService.ts
│   └── walletService.tsx
├── src/
│   ├── app/
│   │   ├── (auth)/         # Auth screens (SignIn, SignUp, Welcome)
│   │   ├── (main)/         # Main screens (Wallet, Profile, Statistics)
│   │   ├── (modals)/       # Modals (Add Wallet, Search, etc.)
│   │   └── \_layout.tsx     # App layout
│   ├── assets/             # Static assets
│   ├── components/
│   │   ├── atoms/          # Buttons, Tabs, etc.
│   │   └── molecules/      # Home cards, recent transactions
│   ├── constants/          # Colors, paths, data
│   ├── hooks/              # Custom React hooks
│   └── utils/              # Helper functions
├── types.ts                # Global TypeScript types/interfaces
├── app.json                # Expo config
├── tsconfig.json           # TypeScript config
├── package.json            # Project metadata
└── README.md               # Project overview

````

---

## 📊 Data Visualization

The **Statistics** screen features a clean and responsive **bar chart** using [`react-native-gifted-charts`]
- Shows daily,weekly and monthly expenses and savings
- Responsive and themed to match the app
- Easy to extend with other chart types (line, pie, etc.)

---


## 🛠️ Tech Stack

- **React Native (Expo)**
- **TypeScript**
- **Firebase (Auth + Firestore)**
- **Cloudinary** – Image uploads
- **Axios** – For HTTP requests
- **React Navigation**
- **React Native Gifted Charts** – For bar chart visualizations
- **TypeScript Custom Types** – Centralized in `types.ts`
- **Modular Architecture** with reusable hooks, services, and components

---

## 🔧 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/italhazahid/expense-tracker.git
cd expense-tracker
````

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Configure Firebase

Update the Firebase config in `config/firebase.ts` using your project credentials.

### 4. Configure Cloudinary

Create a `index.ts` file in constants and update using your project credentials:

```env
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_UPLOAD_PRESET=your-upload-preset
```


### 5. Run the app

```bash
npx expo start
```

---

## ☁️ Cloudinary Upload Service

The file `services/imgServices.tsx` handles image uploads and fallback logic:

### Upload Function

```ts
uploadFileToCloudinary(file, 'wallets');
```

### Helpers

```ts
getProfileImage(file); // fallback to default avatar
getWalletImage(file);  // fallback to null
```

---

## 📷 Screenshots

*will be added later*

* 📊 Statistics screen with bar chart
* 🧾 Transaction history
* 👤 Profile screen
* 💼 Wallet management


---

## ✨ Contributing

Pull requests are welcome! For major changes, open an issue first to discuss what you'd like to modify.

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙌 Acknowledgements

* [Expo](https://expo.dev/)
* [Firebase](https://firebase.google.com/)
* [Cloudinary](https://cloudinary.com/)
* [React Native Gifted Charts](https://github.com/SimformSolutionsPvtLtd/react-native-gifted-charts)
* [React Native](https://reactnative.dev/)
* [TypeScript](https://www.typescriptlang.org/)

---

