import { useState } from 'react'
import LoginPage from './LoginPage'
import OnboardingPage from './OnboardingPage'
import PlanSelectionPage from './PlanSelectionPage'
import DashboardPage from './DashboardPage'
import AdminDashboard from './AdminDashboard'
import ProfilePage from './ProfilePage'
import './index.css'

function App() {
  const [currentPage, setCurrentPage] = useState('login')

  return (
    <>
      <div className="orbs-container">
        <div className="bg-orb orb-1"></div>
        <div className="bg-orb orb-2"></div>
        <div className="bg-orb orb-3"></div>
      </div>
      
      {currentPage === 'login' && <LoginPage onNavigate={setCurrentPage} />}
      {currentPage === 'onboarding' && <OnboardingPage onNavigate={setCurrentPage} />}
      {currentPage === 'planSelection' && <PlanSelectionPage onNavigate={setCurrentPage} />}
      {currentPage === 'dashboard' && <DashboardPage onNavigate={setCurrentPage} />}
      {currentPage === 'admin' && <AdminDashboard onNavigate={setCurrentPage} />}
      {currentPage === 'profile' && <ProfilePage onNavigate={setCurrentPage} />}
    </>
  )
}

export default App
