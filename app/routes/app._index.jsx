import { Page, Layout, LegacyCard, Tabs } from '@shopify/polaris';
import { useState, useCallback } from 'react';
import Customer from './components/Customer';

export default function Index() {
  const [selected, setSelected] = useState(0);


  const handleTabChange = useCallback(
    (selectedTabIndex) => setSelected(selectedTabIndex),
    [],
  );

  const tabs = [
    {
      id: 'all-customers-1',
      content: 'All',
      accessibilityLabel: 'All customers',
      panelID: 'all-customers-content-1',
    },
    {
      id: 'repeat-customers-1',
      content: 'Customers',
      panelID: 'repeat-customers-content-1',
    },
  ];

  console.log("selected ======", selected);

  function whichtorender() {
    switch (selected) {
      case 1:
        return <Customer />
    }
  }



  return (
    <>

      {/* <Page> */}
        {/* <Layout> */}
          {/* <Layout.Section> */}
            <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
              <LegacyCard.Section title={tabs[selected].content}>
                {whichtorender()}
              </LegacyCard.Section>
            </Tabs>
          {/* </Layout.Section> */}
        {/* </Layout> */}
      {/* </Page> */}


    </>
  );
}


