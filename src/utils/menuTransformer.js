import { getIconComponent } from "../constants/menuItem";

// Transform backend pages data to menu items
export const transformPagesToMenuItems = (pages = []) => {
  if (!pages || !Array.isArray(pages) || pages.length === 0) {
    console.warn('No pages data provided to transformPagesToMenuItems');
    return [];
  }

  try {
    // Group pages by module
    const modules = {};
    
    pages.forEach(page => {
      if (!page || typeof page !== 'object') return;
      
      const moduleName = page.module || 'Other';
      const moduleIcon = page.module_icon || 'SettingOutlined';
      
      if (!modules[moduleName]) {
        modules[moduleName] = {
          name: moduleName,
          icon: moduleIcon,
          pages: []
        };
      }
      
      modules[moduleName].pages.push({
        id: page.id,
        name: page.name,
        codename: page.codename,
        url_name: page.url_name,
        module_icon: page.module_icon,
        parent: page.parent,
        module_order: page.module_order || 999,
        order: page.order || 999,
        native_permission_codename: page.native_permission_codename
      });
    });

    // Sort modules by module_order
    const sortedModules = Object.values(modules).sort((a, b) => {
      const firstPageA = a.pages[0];
      const firstPageB = b.pages[0];
      return (firstPageA?.module_order || 999) - (firstPageB?.module_order || 999);
    });

    // Build hierarchical menu structure
    const menuItems = [];

    sortedModules.forEach(module => {
      const modulePages = module.pages.sort((a, b) => (a.order || 999) - (b.order || 999));
      
      // Find root level pages (pages with no parent or parent = null)
      const rootPages = modulePages.filter(page => !page.parent || page.parent === null);
      
      if (rootPages.length === 1) {
        // If only one root page, it becomes the main menu item
        const rootPage = rootPages[0];
        const children = modulePages.filter(page => page.parent === rootPage.id);
        
        if (children.length > 0) {
          // Has children - create nested menu
          menuItems.push({
            key: rootPage.url_name,
            icon: getIconComponent(rootPage.module_icon || module.icon),
            label: rootPage.name,
            children: children.map(child => ({
              key: child.url_name,
              icon: getIconComponent(child.module_icon),
              label: child.name
            }))
          });
        } else {
          // No children - single menu item
          menuItems.push({
            key: rootPage.url_name,
            icon: getIconComponent(rootPage.module_icon || module.icon),
            label: rootPage.name
          });
        }
      } else if (rootPages.length > 1) {
        // Multiple root pages - group under module name
        const moduleKey = `/${module.name.toLowerCase().replace(/\s+/g, '-')}`;
        
        const moduleItem = {
          key: moduleKey,
          icon: getIconComponent(module.icon),
          label: module.name,
          children: rootPages.map(page => {
            const children = modulePages.filter(child => child.parent === page.id);
            
            if (children.length > 0) {
              return {
                key: page.url_name,
                icon: getIconComponent(page.module_icon),
                label: page.name,
                children: children.map(child => ({
                  key: child.url_name,
                  icon: getIconComponent(child.module_icon),
                  label: child.name
                }))
              };
            } else {
              return {
                key: page.url_name,
                icon: getIconComponent(page.module_icon),
                label: page.name
              };
            }
          }).filter(Boolean) // Remove any null/undefined items
        };
        
        menuItems.push(moduleItem);
      }
    });

    console.log('Transformed menu items:', menuItems);
    return menuItems;
  } catch (error) {
    console.error('Error transforming pages to menu items:', error);
    return [];
  }
};