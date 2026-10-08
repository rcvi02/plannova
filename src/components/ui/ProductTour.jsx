import React, { useState, useEffect } from 'react';
import { Joyride, STATUS } from 'react-joyride';

export default function ProductTour() {
  const [run, setRun] = useState(false);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('plannova-tour-seen');
    const isNewUser = sessionStorage.getItem('plannova-new-user') === 'true';
    if (!hasSeenTour && isNewUser) {
      setRun(true);
    }
  }, []);

  const steps = [
    {
      target: 'body',
      content: 'Welcome to Plannova! Let\'s take a quick tour to help you get the most out of your premium study planner.',
      placement: 'center',
      disableBeacon: true,
    },
    {
      target: '#sidebar',
      content: 'Here is your main navigation. Access your Dashboard, Planner, Calendar, Tasks, and more from this sidebar.',
      placement: 'right',
    },
    {
      target: '#command-palette-btn',
      content: 'Press Ctrl+K (or Cmd+K) or click here to open the Command Palette. It lets you quickly search and jump anywhere in the app.',
      placement: 'bottom',
    },
    {
      target: '#theme-toggle-btn',
      content: 'Toggle between Light, Dark, or System themes to personalize your workspace.',
      placement: 'bottom',
    },
    {
      target: '#profile-menu-btn',
      content: 'Manage your settings, view your profile, or log out from here.',
      placement: 'bottom-end',
    },
    {
      target: '#main-content',
      content: 'This is where your active page lives. Start planning your success!',
      placement: 'center',
    }
  ];

  const handleJoyrideCallback = (data) => {
    const { status } = data;
    const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      setRun(false);
      localStorage.setItem('plannova-tour-seen', 'true');
    }
  };

  return (
    <Joyride
      callback={handleJoyrideCallback}
      continuous
      hideCloseButton
      run={run}
      scrollToFirstStep
      showProgress
      showSkipButton
      steps={steps}
      styles={{
        options: {
          zIndex: 10000,
          primaryColor: 'var(--accent)',
          backgroundColor: 'var(--bg-surface)',
          arrowColor: 'var(--bg-surface)',
          textColor: 'var(--text-primary)',
          overlayColor: 'rgba(0, 0, 0, 0.5)',
        },
        buttonClose: {
          color: 'var(--text-primary)'
        },
        buttonNext: {
          backgroundColor: 'var(--accent)',
          borderRadius: '999px',
          fontWeight: 600,
          padding: '8px 16px',
        },
        buttonBack: {
          color: 'var(--text-secondary)',
          marginRight: 10,
        },
        buttonSkip: {
          color: 'var(--text-secondary)',
          fontSize: '14px'
        },
        tooltipContainer: {
          textAlign: 'left'
        },
        tooltip: {
          borderRadius: '12px',
          padding: '16px',
          boxShadow: 'var(--shadow-xl)',
          border: '1px solid var(--border)'
        },
      }}
    />
  );
}
