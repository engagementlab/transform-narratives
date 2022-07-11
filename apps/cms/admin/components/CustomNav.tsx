
import type { NavigationProps } from '@keystone-6/core/admin-ui/components';
import { NavigationContainer, NavItem, ListNavItems } from '@keystone-6/core/admin-ui/components';
import React from 'react';

// import app from '../../currentApp';

const listMapping = new Map<string, string>([
  ['Abouts', 'About Page'],
  ['Big Pictures', 'Big Picture Page'],
  ['Communities', 'Community Page'],
  ['Homes', 'Home'],
]);

export function CustomNavigation({ authenticatedItem, lists }: NavigationProps) {
  return (
    <NavigationContainer authenticatedItem={authenticatedItem}>
          <NavItem href="/">Dashboard</NavItem>

          {lists.map((list, i) => {
            return (
                <NavItem key={i} href={`/${list.path}`}>{listMapping.get(list.label) ? listMapping.get(list.label) : list.label}</NavItem>
              )
          }
          )}
          <hr style={{width: '85%', borderWidth: '1px', borderColor: 'grey'}} />
          <NavItem href="/media"><span>Media Library</span></NavItem>
          <NavItem href="/deploy"><span style={{color: '#f6a536'}}>Deploy</span></NavItem>
    </NavigationContainer>
  )
}