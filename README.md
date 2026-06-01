# BookLog
BookLog is a website where users can track what books they have read and books they plan to read. The website also allow users to search for books and see details about them such as description, rating and so on. Users can also leave a review and rate a book that they have read. The intended users of the website are people who are into reading books and want to manage their hobby better. The intended user is 15 years of age or older.

## Tech-Stack
- TypeScript        - The website is built using TypeScript to make run time errors less prevalent
- React             - The project uses React to allow the projects to use reusable components  
- BootStrap React   - The project uses React components built and distributed by BootStrap
- Vite              - The project uses Vite to allow the website to be run on a local server

## Why React?
React was choosen because of the following reason
* Reusable components - We knew beforehand that we would probably need to use the same components throughout several pages. React allow us to create and reuse components instead of rewriting the same code over and over again[1].
* Virtual DOM - The site processes a lot of card components for the books. React allows for a virtual DOM which means only the changed parts of a site gets uptaded rather then the whole site, which improves the performence[1].
* BootStrap React - BootStrap has components they developed and distribute. By using using BootStrap react, we save a lot of time since we do not need to build the components ourselves.
* Workplace presnce - React is currently and has been for some time a big part of the job market[2]. While everyone in the group has had some previous experience with React, we all saw it as an oppertunity to build the website with React to improve our understanding of the framework

The other frameworks considered while planning the website were Vue and Angular. Angular was quite quickly dismissed given that it is a framework focused on building large-scale, complex applications, which the website we planned to build was not [3], [4]. Angular also has a steeper learning curve, requiring profiecny in TS/JS and HTML[3]. React and Vue also require some profiecency in TS and HTML, but we already had some experience with React making the learning curve less for us, and Vue is known for being basic and has excellent documentaiton[5][6]. Given the small development time allocated for this project, we dismissed Angular and it was now between React and Vue. We could have choosen between both Vue and React since they both fit the project. Vue as mentioned earlier has a low learning curve and offers good documentaiton. Vue also offer the ability to build components just like React[6]. React was choosen, however, because React is used more by developers compared to Vue[2]. Learning React is therefore more valuable for us since it is a more desired skill. React was also choosen because we all had some experience with the framework. Sure, Vue can easily be learnt according to [5], but we already knew most of React. Given that only 10, 4 hour-workdays were attributed to the project, we choose to use the framework that allowed us to start the development as quick as possible, which was React in our case.

## How to run 
### Prerequisites 
- Make sure that you have Node.js and Vite downloaded
- Make sure you have a console like git bash to run commands

### Steps to run
1. Clone the repository.
2. Open the command console.
3. Navigate to the projects root folder via the console.
4. Run the following command in the console "npm install" and wait for the install to complete
5. Run the following command in the console "npm run dev"
6. Wait until a link is showing the console. 
7. Copy the link and search for it in the URL bar in a web browser.

## References
[1] ‘What are the advantages of React.js ?’, GeeksforGeeks. Accessed: May 30, 2026. [Online]. Available: https://www.geeksforgeeks.org/reactjs/what-are-the-advantages-of-react-js/

[2] O. Cordos, ‘Best Frontend Frameworks 2026: Every Major JavaScript Framework You Need to Know’, QuartzDevs. Accessed: May 30, 2026. [Online]. Available: https://quartzdevs.com/resources/best-frontend-frameworks-2026-every-major-javascript-framework

[3] ‘Angular Tutorial’, GeeksforGeeks. Accessed: May 30, 2026. [Online]. Available: https://www.geeksforgeeks.org/angular-js/angular-tutorial/

[4] ‘What is Angular?’ Accessed: May 30, 2026. [Online]. Available: https://angular.dev/

[5] ‘7 Reasons Why VueJS Is So Popular?’, GeeksforGeeks. Accessed: May 30, 2026. [Online]. Available: https://www.geeksforgeeks.org/blogs/7-reasons-why-vuejs-is-so-popular/

[6] ‘Vue.js’. Accessed: May 30, 2026. [Online]. Available: https://vuejs.org/