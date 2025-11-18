# 🎮 GameMart 2.0 - Clean Slate Ready

## ✅ Project Structure Cleared

All test code has been removed. The project now contains only basic templates for you to build upon.

---

## 📁 Current File Structure

### Components (4 files)
```
src/components/
├── Navbar.jsx           ✅ Empty template
├── Footer.jsx           ✅ Empty template
├── GameCard.jsx         ✅ Empty template (Bisma)
└── CartItem.jsx         ✅ Empty template (Bisma)
```

### Pages (9 files)
```
src/pages/
├── Home.jsx             ✅ Empty template
├── Store.jsx            ✅ Empty template (Bisma)
├── Cart.jsx             ✅ Empty template (Bisma)
├── Rewards.jsx          ✅ Empty template (Halima)
├── Leaderboard.jsx      ✅ Empty template (Halima)
├── MiniGame.jsx         ✅ Empty template (Halima)
├── Login.jsx            ✅ Empty template (Asma)
├── Signup.jsx           ✅ Empty template (Asma)
└── Profile.jsx          ✅ Empty template (Asma)
```

### Context & Data
```
src/context/
└── UserContext.jsx      ✅ Basic template (Asma)

src/data/
├── games.json           ✅ 12 sample games (ready to use)
├── users.json           ✅ Mock users (ready to use)
├── rewards.json         ✅ Missions data (ready to use)
└── chat.json            ✅ Chat & offers (ready to use)
```

### Configuration Files
```
src/
├── App.jsx              ✅ Routing configured
├── index.css            ✅ Basic styles with Tailwind
└── App.css              ✅ Minimal styles
```

---

## 🎯 What's Ready to Use

### ✅ Pre-configured:
- React Router (all routes set up)
- Tailwind CSS (styling framework)
- Framer Motion (animations library)
- React Icons (icon library)
- Mock JSON data (games, users, rewards, chat)

### ✅ Working:
- Navigation between pages
- Dark theme setup
- Basic app structure
- Development server

---

## 💻 Each File Contains

### Component Files:
```jsx
const ComponentName = () => {
  return (
    <div>
      {/* Add your code here */}
    </div>
  );
};

export default ComponentName;
```

### Page Files:
```jsx
const PageName = () => {
  return (
    <div>
      {/* Add your page code here */}
      <h1>Page Title</h1>
    </div>
  );
};

export default PageName;
```

---

## 🚀 Start Building

### 1. Start the dev server (if not running):
```bash
cd gamemart
npm run dev
```

### 2. Open in browser:
- Go to `http://localhost:5174` (or the port shown in terminal)

### 3. Start coding:
- Each team member works on their assigned files
- Use the mock JSON data from `src/data/` folder
- Style with Tailwind CSS classes
- Add animations with Framer Motion

---

## 👥 Team Member Files

### 👩‍💻 Bisma:
- `src/components/GameCard.jsx` - Game product cards
- `src/components/CartItem.jsx` - Shopping cart items
- `src/pages/Store.jsx` - Game browsing page
- `src/pages/Cart.jsx` - Shopping cart page

### 👩‍💻 Asma:
- `src/context/UserContext.jsx` - User state management
- `src/pages/Login.jsx` - Login page
- `src/pages/Signup.jsx` - Registration page
- `src/pages/Profile.jsx` - User profile page

### 👩‍💻 Halima:
- `src/pages/Rewards.jsx` - Rewards & missions page
- `src/pages/Leaderboard.jsx` - Player rankings page
- `src/pages/MiniGame.jsx` - Mini games arcade

### 🤝 Shared:
- `src/components/Navbar.jsx` - Navigation bar
- `src/components/Footer.jsx` - Site footer
- `src/pages/Home.jsx` - Landing page

---

## 📚 Quick Reference

### Import Mock Data:
```jsx
import gamesData from '../data/games.json';
import usersData from '../data/users.json';
import rewardsData from '../data/rewards.json';
import chatData from '../data/chat.json';
```

### Use Routing:
```jsx
import { Link, useNavigate } from 'react-router-dom';

// Link to pages
<Link to="/store">Go to Store</Link>

// Programmatic navigation
const navigate = useNavigate();
navigate('/cart');
```

### Use User Context (Asma to implement):
```jsx
import { useUser } from '../context/UserContext';

const { user, setUser } = useUser();
```

### Use Tailwind Classes:
```jsx
<div className="bg-gray-800 text-white p-4 rounded-lg">
  <h1 className="text-2xl font-bold">Title</h1>
</div>
```

### Use Framer Motion:
```jsx
import { motion } from 'framer-motion';

<motion.div
  whileHover={{ scale: 1.05 }}
  className="card"
>
  Content
</motion.div>
```

### Use Icons:
```jsx
import { FaGamepad, FaUser, FaHeart } from 'react-icons/fa';

<FaGamepad size={24} className="text-cyan-400" />
```

---

## 🎨 Recommended Approach

### 1. Start with Structure:
- Build the HTML/JSX layout first
- Don't worry about styling initially

### 2. Add Styling:
- Use Tailwind classes for quick styling
- Keep the dark gaming theme (grays, purples, cyans)

### 3. Add Interactivity:
- Add state management with `useState`
- Handle user interactions
- Connect to mock data

### 4. Add Polish:
- Add Framer Motion animations
- Refine responsive design
- Test on different screen sizes

---

## 📊 Mock Data Available

### Games (games.json):
- 12 games with different consoles (PS5, PS4, Xbox, PC)
- Includes: title, price, genre, rating, image, stock

### Users (users.json):
- 3 test accounts
- Includes: username, email, coins, XP, tier, badges

### Rewards (rewards.json):
- 6 missions/quests
- User stats (coins, XP, tier)

### Chat (chat.json):
- Sample chat messages
- Special offers/deals

---

## 💡 Tips

1. **Work in your assigned files** - Avoid merge conflicts
2. **Test frequently** - Save and check browser often
3. **Use console.log()** - Debug your code
4. **Ask for help** - Check documentation or ask teammates
5. **Commit regularly** - Save progress with Git

---

## 🔧 Useful Commands

```bash
# Start dev server
npm run dev

# Install new package
npm install package-name

# Build for production
npm run build

# Check for errors
npm run lint
```

---

## 🎯 Next Steps

1. **Plan your component/page layout**
2. **Write HTML structure**
3. **Add Tailwind styling**
4. **Connect to mock data**
5. **Add interactivity**
6. **Test and refine**

---

**Happy Coding! 🚀**

Your clean slate is ready. Build something amazing!
