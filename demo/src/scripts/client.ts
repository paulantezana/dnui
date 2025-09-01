// // Client-side initialization script for DNUI library
// // This script runs on the frontend and initializes all DNUI components

// // Dynamic import to handle client-side loading
// const initDNUI = async () => {
//   try {
//     await import('@dnui/ui');
//     console.log('DNUI library loaded successfully');
//   } catch (error) {
//     console.error('Failed to load DNUI library:', error);
//   }
// };

// // Initialize DNUI components when DOM is ready
// document.addEventListener('DOMContentLoaded', async () => {
//   await initDNUI();
//   console.log('DNUI library initialized');
// });

// // Handle theme switching
// // const themeInputs = document.querySelectorAll('input[name="snTheme"]');
// // themeInputs.forEach(input => {
// //   input.addEventListener('change', (event) => {
// //     const target = event.target as HTMLInputElement;
// //     const theme = target.value;
// //     const html = document.documentElement;

// //     // Remove existing theme classes
// //     html.classList.remove('dn-theme-light', 'dn-theme-dark');

// //     if (theme === 'system') {
// //       // Use system preference
// //       const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
// //       html.classList.add(prefersDark ? 'dn-theme-dark' : 'dn-theme-light');
// //     } else {
// //       html.classList.add(`dn-theme-${theme}`);
// //     }
// //   });
// // });

// // Initialize theme on load
// document.addEventListener('DOMContentLoaded', function () {
//   document.documentElement.classList.add(`dn-theme-dark`);
// });

// // const savedTheme = localStorage.getItem('dnui-theme') || 'light';
// // const themeInput = document.querySelector(`input[value="${savedTheme}"]`) as HTMLInputElement;
// // if (themeInput) {
// //   themeInput.checked = true;
// //   themeInput.dispatchEvent(new Event('change'));
// // }
