# BookLog
BookLog is a website where users can track what books they have read and books they plan to read. The website also allows users to search for books and see details about them such as their description, rating and so on. Users can also leave a review and rate a book that they have read. The intended users of the website are people who are into reading books and want to manage their hobby better. The intended user is 15 years of age or older.

## Tech-Stack
- TypeScript        - The website is built using TypeScript to make run time errors less prevalent.
- React             - The project uses React to allow the projects to use reusable components.
- BootStrap React   - The project uses React components built and distributed by BootStrap.
- Vite              - The project uses Vite to allow the website to be run on a local server.

## Why React?
React was chosen for the following reasons:
* Reusable components - We knew beforehand that we would probably need to use the same components throughout several pages. React allows us to create and reuse components instead of rewriting the same code over and over again[1].
* Virtual DOM - The site processes a lot of card components for the books. React allows for a virtual DOM which means only the changed parts of a site get updated rather than the whole site, which improves the performance[1].
* BootStrap React - BootStrap has components they develope and distribute. By using using BootStrap react, we save a lot of time since we do not need to build the components ourselves.
* Workplace precense - React is currently and has been for some time a big part of the job market[2]. While everyone in the group has had some previous experience with React, we all saw it as an opportunity to build the website with React to improve our understanding of the framework

The other frameworks considered while planning the website were Vue and Angular. Angular was quite quickly dismissed given that it is a framework focused on building large-scale, complex applications, which the website we planned to build was not [3], [4]. Angular also has a steeper learning curve, requiring proficiency in TS/JS and HTML[3]. React and Vue also require some proficiency in TS and HTML, but we already had some experience with React making the learning curve less for us, and Vue is known for being basic and has excellent documentation[5][6]. Given the small development time allocated for this project, we dismissed Angular and it was now between React and Vue. We could have chosen between both Vue and React since they both fit the project. Vue as mentioned earlier has a low learning curve and offers good documentation. Vue also offer the ability to build components just like React[6]. React was chosen, however, because React is used more by developers compared to Vue[2]. Learning React is therefore more valuable for us since it is a more desired skill. React was also choosen because we all had some experience with the framework. Sure, Vue can easily be learnt according to [5], but we already know most of React. Given that only 10, 4 hour-workdays were attributed to the project, we chose to use the framework that allowed us to start the development as quickly as possible, which was React in our case.

## How to run 
### Prerequisites 
- Make sure that you have Node.js and Vite downloaded
- Make sure you have a console like git bash to run commands

### Steps to run
1. Clone the repository.
2. Create a .env file in the project root.
3. Collect the information containing the API keys from Canvas that we put as a comment on the assignment hand-over.
4. Put the API keys and other information that we put as a comment on Canvas, in the .env file
5. Open the command console.
6. Navigate to the projects root folder via the console.
7. Run the following command in the console "npm install" and wait for the install to complete.
8. Run the following command in the console "npm run dev".
9. Wait until a link is showing the console. 
10. Copy the link and search for it in the URL bar in a web browser, or hold CTRL while pressing the link.

## OBS!!!
- The API keys only have 50 API calls per key. If you run out of calls while using website, do the following:
1. Go to .env file.
2. Comment out the currently used API key by typing "#" before the API key
3. Remove the "#" from another API key that has not already been used.
4. If no keys work or if you run out of API calls, please contact us throguh Canvas messaging

## References
[1] ‘What are the advantages of React.js ?’, GeeksforGeeks. Accessed: May 30, 2026. [Online]. Available: https://www.geeksforgeeks.org/reactjs/what-are-the-advantages-of-react-js/

[2] O. Cordos, ‘Best Frontend Frameworks 2026: Every Major JavaScript Framework You Need to Know’, QuartzDevs. Accessed: May 30, 2026. [Online]. Available: https://quartzdevs.com/resources/best-frontend-frameworks-2026-every-major-javascript-framework

[3] ‘Angular Tutorial’, GeeksforGeeks. Accessed: May 30, 2026. [Online]. Available: https://www.geeksforgeeks.org/angular-js/angular-tutorial/

[4] ‘What is Angular?’ Accessed: May 30, 2026. [Online]. Available: https://angular.dev/

[5] ‘7 Reasons Why VueJS Is So Popular?’, GeeksforGeeks. Accessed: May 30, 2026. [Online]. Available: https://www.geeksforgeeks.org/blogs/7-reasons-why-vuejs-is-so-popular/

[6] ‘Vue.js’. Accessed: May 30, 2026. [Online]. Available: https://vuejs.org/