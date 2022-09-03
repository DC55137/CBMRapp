import { useState } from 'react';

// ----------------------------------------------------------------------

export default function useTabs(defaultValues, setPage) {
  const [currentTab, setCurrentTab] = useState(defaultValues || '');

  return {
    currentTab,
    onChangeTab: (event, newValue) => {
      setCurrentTab(newValue);
      setPage(0);
    },
    setCurrentTab,
  };
}
