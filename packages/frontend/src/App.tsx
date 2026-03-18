import { Routes, Route } from "react-router-dom";
import MainLayout from '@/layouts/MainLayout.tsx';
import Home from '@/pages/Home.tsx';
import MemberPlan from "./pages/MemberPlan";
import MemberProfile from "./pages/MemberProfile";
import MemberRegister from "./pages/MemberRegister.tsx";
import RewardExchange from "./pages/RewardExchange";
import RewardPoint from "./pages/RewardPoint";
import HistoryContent from "./pages/HistoryContent";
import HistoryState from "./pages/HistoryState";
import WorkoutTracking from "./pages/WorkoutTracking";
import RewardAchievement from "./pages/RewardAchievement.tsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />           {/* / */}
        <Route path="*" element={<div>404 Not Found</div>} />
      </Route>
      <Route path="/workout/tracking" element={<MainLayout />}>
        <Route index element={<WorkoutTracking />} />           {/* / */}
        <Route path="*" element={<div>404 Not Found</div>} />
      </Route>
      <Route path="/history/state" element={<MainLayout />}>
        <Route index element={<HistoryState />} />           {/* / */}
        <Route path="*" element={<div>404 Not Found</div>} />
      </Route>      
      <Route path="/history/content" element={<MainLayout />}>
        <Route index element={<HistoryContent />} />           {/* / */}
        <Route path="*" element={<div>404 Not Found</div>} />
      </Route>      
      <Route path="/reward/exchange" element={<MainLayout />}>
        <Route index element={<RewardExchange />} />           {/* / */}
        <Route path="*" element={<div>404 Not Found</div>} />
      </Route>      
      <Route path="/reward/point" element={<MainLayout />}>
        <Route index element={<RewardPoint />} />           {/* / */}
        <Route path="*" element={<div>404 Not Found</div>} />
      </Route>      
       <Route path="/reward/achievement" element={<MainLayout />}>
        <Route index element={<RewardAchievement />} />           {/* / */}
        <Route path="*" element={<div>404 Not Found</div>} />
      </Route>
      <Route path="/member/register" element={<MainLayout />}>
        <Route index element={<MemberRegister />} />           {/* / */}
        <Route path="*" element={<div>404 Not Found</div>} />
      </Route>            
      <Route path="/member/profile" element={<MainLayout />}>
        <Route index element={<MemberProfile />} />           {/* / */}
        <Route path="*" element={<div>404 Not Found</div>} />
      </Route>      
      <Route path="/member/plan" element={<MainLayout />}>
        <Route index element={<MemberPlan />} />           {/* / */}
        <Route path="*" element={<div>404 Not Found</div>} />
      </Route>      
    </Routes>
  );
}

export default App;