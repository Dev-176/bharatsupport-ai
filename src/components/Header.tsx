import React from 'react';
import { Bot, MessageSquare, BarChart3, Sliders, Inbox, BookOpen, Users, Smartphone, Monitor } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

export type ActiveTab = 'chat' | 'dashboard' | 'confidence' | 'inbox' | 'knowledge' | 'leads';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  openTicketsCount: number;
  newLeadsCount: number;
  isMobileDeviceFrame: boolean;
  setIsMobileDeviceFrame: (val: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  openTicketsCount,
  newLeadsCount,
  isMobileDeviceFrame,
  setIsMobileDeviceFrame,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Main Navigation: 3-Zone Top Bar Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Zone 1: Wordmark / Brand */}
          <button
            onClick={() => setActiveTab('chat')}
            className="flex items-center gap-2.5 text-left select-none group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-lg p-1"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs group-hover:bg-blue-700 transition-colors">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <span className="font-display text-lg sm:text-xl font-bold tracking-tight text-slate-900 block leading-tight">
                BharatSupport <span className="text-blue-600">AI</span>
              </span>
              <span className="text-[11px] text-slate-500 font-medium block leading-none mt-0.5">
                Multilingual Support Platform
              </span>
            </div>
          </button>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'chat'
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <MessageSquare className="w-4 h-4 text-blue-600" />
              <span>Channels</span>
            </button>

            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'dashboard'
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-blue-600" />
              <span>Analytics</span>
            </button>

            <button
              onClick={() => setActiveTab('confidence')}
              className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'confidence'
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Sliders className="w-4 h-4 text-blue-600" />
              <span>Confidence Engine</span>
            </button>

            <button
              onClick={() => setActiveTab('inbox')}
              className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap relative ${
                activeTab === 'inbox'
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Inbox className="w-4 h-4 text-blue-600" />
              <span>Support Desk</span>
              {openTicketsCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-xs font-mono font-bold bg-rose-500 text-white tabular-nums">
                  {openTicketsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('knowledge')}
              className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'knowledge'
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span>Knowledge Base</span>
            </button>

            <button
              onClick={() => setActiveTab('leads')}
              className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'leads'
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Users className="w-4 h-4 text-blue-600" />
              <span>Lead Pipeline</span>
              {newLeadsCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-xs font-mono font-bold bg-amber-500 text-white tabular-nums">
                  {newLeadsCount}
                </span>
              )}
            </button>
          </nav>

          {/* Zone 3: Primary Actions */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setIsMobileDeviceFrame(!isMobileDeviceFrame)}
              className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                isMobileDeviceFrame
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
              title="Toggle Mobile Simulator Frame"
            >
              {isMobileDeviceFrame ? (
                <>
                  <Monitor className="w-3.5 h-3.5 text-blue-400" />
                  <span>Desktop View</span>
                </>
              ) : (
                <>
                  <Smartphone className="w-3.5 h-3.5 text-slate-600" />
                  <span>Mobile Frame</span>
                </>
              )}
            </button>

            <PWAInstallButton />
          </div>
        </div>
      </div>

      {/* Mobile Submenu Bar */}
      <div className="lg:hidden border-t border-slate-200 bg-white px-2 py-1.5 flex items-center justify-between gap-1 overflow-x-auto text-xs">
        <button
          onClick={() => setActiveTab('chat')}
          className={`px-2.5 py-1.5 rounded-md whitespace-nowrap transition-colors ${
            activeTab === 'chat' ? 'text-blue-700 font-bold bg-blue-50' : 'text-slate-600'
          }`}
        >
          Channels
        </button>
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-2.5 py-1.5 rounded-md whitespace-nowrap transition-colors ${
            activeTab === 'dashboard' ? 'text-blue-700 font-bold bg-blue-50' : 'text-slate-600'
          }`}
        >
          Analytics
        </button>
        <button
          onClick={() => setActiveTab('confidence')}
          className={`px-2.5 py-1.5 rounded-md whitespace-nowrap transition-colors ${
            activeTab === 'confidence' ? 'text-blue-700 font-bold bg-blue-50' : 'text-slate-600'
          }`}
        >
          Confidence
        </button>
        <button
          onClick={() => setActiveTab('inbox')}
          className={`px-2.5 py-1.5 rounded-md whitespace-nowrap transition-colors flex items-center gap-1 ${
            activeTab === 'inbox' ? 'text-blue-700 font-bold bg-blue-50' : 'text-slate-600'
          }`}
        >
          <span>Desk</span>
          {openTicketsCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-rose-500 text-white font-bold">
              {openTicketsCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('knowledge')}
          className={`px-2.5 py-1.5 rounded-md whitespace-nowrap transition-colors ${
            activeTab === 'knowledge' ? 'text-blue-700 font-bold bg-blue-50' : 'text-slate-600'
          }`}
        >
          Knowledge
        </button>
        <button
          onClick={() => setActiveTab('leads')}
          className={`px-2.5 py-1.5 rounded-md whitespace-nowrap transition-colors flex items-center gap-1 ${
            activeTab === 'leads' ? 'text-blue-700 font-bold bg-blue-50' : 'text-slate-600'
          }`}
        >
          <span>Leads</span>
          {newLeadsCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-amber-500 text-white font-bold">
              {newLeadsCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
