# PICTRU

## Project Motivation:

The rise of AI-generated imagery and the ease of digital manipulation have made it increasingly difficult to discern real from fake content online. This project was conceived as a response to these challenges, aiming to:

• Encourage transparency about image origins <br>
• Facilitate more precise and meaningful discussions about visual content <br>
• Promote digital literacy by making users more aware of different types of visual media <br>

## Key Features:

• Precise Image Commentary: Users can select specific points on images when commenting, allowing for more targeted and contextual discussions. <br>
• Image Nature Tags: Each upload requires a tag indicating how the image was created (e.g., AI-generated, photograph, painting), promoting honesty about content origin. <br>
• Smart Description Templates: Selecting an image tag automatically populates the description field with relevant prompts, encouraging users to provide accurate and detailed information about the image's creation. <br>

## Screenshots

<p align="center"> <img src="Screenshots/Picture0.png"/></p>
<p align="center">Database scheme</p>

<p align="center"> <img src="Screenshots/Picture1.png"/></p>
<p align="center">Main page (user not logged in)</p>

<p>When you click on the "Gallery" button in the navigation bar, the gallery page with filtering and sorting bar opens.</p>
<p align="center"> <img src="Screenshots/Picture2.png"/></p>
<p align="center">Gallery page</p>

<p>Clicking on an image opens the image preview page, showing an enlarged image, comments section, image description, view count, and like count. Comments with a linked image location have a tag indicating this. Hovering over such a comment highlights the linked image location. A logged-out user cannot leave comments, increase the like count, or report incorrectly tagged images.</p>
<p align="center"> <img src="Screenshots/Picture3.png"/></p>
<p align="center">Image preview page</p>

<p>Clicking on an image enlarges it to full screen.</p>
<p align="center"> <img src="Screenshots/Picture4.png"/></p>
<p align="center">Enlarged image</p>

<p>Clicking on the name of the user who uploaded the image or left a comment opens the profile page. The profile page displays the user's description, comments section, and uploaded images. A logged-out user cannot leave a profile comment.</p>
<p align="center"> <img src="Screenshots/Picture5.png"/></p>
<p align="center">User profile view page</p>

<p>Clicking on the "Sign up" button in the navigation bar opens the registration page.</p>
<p align="center"> <img src="Screenshots/Picture6.png"/></p>
<p align="center">Registration page</p>

<p>After registering or clicking on the "Log in" button in the navigation bar, the login page opens.</p>
<p align="center"> <img src="Screenshots/Picture7.png"/></p>
<p align="center">Login page</p>

<p>The navigation bar of a logged-in user is updated with buttons for "Suspended images" to view blocked images, "Upload" to upload a new image, "My account" to view the profile, "Become premium" to become a "Premium" user, and "Logout" to log out.</p>
<p align="center"> <img src="Screenshots/Picture8.png"/></p>
<p align="center">User navigation bar</p>

<p>Clicking the "Upload" button opens the image upload page.</p>
<p align="center"> <img src="Screenshots/Picture9.png"/></p>
<p align="center">Image upload page</p>

<p>In the image upload page, selecting tags automatically updates the "Description" text field indicating what description the user should add. Clicking "Post" opens the image preview page.</p>
<p align="center"> <img src="Screenshots/Picture10.png"/></p>
<p align="center">Image upload page with data</p>

<p>In the image preview page, the user can write a comment, edit or delete it. Edit and delete the image if the user is the image author. Like or report incorrectly tagged images.</p>
<p align="center"> <img src="Screenshots/Picture11.png"/></p>
<p align="center">Image preview page</p>

<p>When editing a comment, the comment form elements are changed. The button that was used to link the image location to the comment becomes the button that cancels the comment editing. The text and the comment save button indicating that the comment is being edited are also updated.</p>
<p align="center"> <img src="Screenshots/Picture12.png"/></p>
<p align="center">Comment editing</p>

<p>When trying to delete an image, a "Dialog" type element with action confirmation is called.</p>
<p align="center"> <img src="Screenshots/Picture13.png"/></p>
<p align="center">Image deletion confirmation message</p>

<p>Clicking the "Edit" button opens the image editing page. The editing page is similar to the image upload page, but the difference is that you cannot upload a new image.</p>
<p align="center"> <img src="Screenshots/Picture14.png"/></p>
<p align="center">Image information editing page</p>

<p>If the user is on their profile view page, they will see a button to edit profile information and delete comments left by other users.</p>
<p align="center"> <img src="Screenshots/Picture15.png"/></p>
<p align="center">User profile page</p>

<p>Clicking the pencil button opens the profile editing page, where the user can change their description and picture.</p>
<p align="center"> <img src="Screenshots/Picture16.png"/></p>
<p align="center">User profile editing form</p>

<p>Clicking on the user's name in the navigation bar and opening the "Become Premium" page, the user can enter credit card details and obtain "Premium" status.</p>
<p align="center"> <img src="Screenshots/Picture17.png"/></p>
<p align="center">“Premium” status purchase page</p>

<p>After entering the correct card details and clicking the "Become Premium!" button, a message about successful payment and obtaining "Premium" status is displayed.</p>
<p align="center"> <img src="Screenshots/Picture18.png"/></p>
<p align="center">Successful payment message</p>

<p>Users with "Premium" status have stars next to their names when viewing their profile or uploaded image.</p>
<p align="center"> <img src="Screenshots/Picture19.png"/></p>
<p align="center">“Premium” user profile view page</p>

<p>For demonstration purposes, the status of images uploaded by the user is changed to "suspended". The user can view the images by clicking the "Suspended images" button in the navigation bar.</p>
<p align="center"> <img src="Screenshots/Picture20.png"/></p>
<p align="center">User blocked images view page</p>

<p>Clicking on a blocked image opens the blocked image view page. In the view page, the user can change the image tags and update the description. Clicking the "Appeal suspension" button will change the image status to "Appealed".</p>
<p align="center"> <img src="Screenshots/Picture21.png"/></p>
<p align="center">Blocked image view page</p>

<p>The navigation bar of a user with a moderator role is updated by adding an "Admin" section, through which you can access the pages for viewing appealed images and all blocked images.</p>
<p align="center"> <img src="Screenshots/Picture22.png"/></p>
<p align="center">Moderator's navigation bar</p>

<p>In the all blocked images page, all blocked images of users are visible.</p>
<p align="center"> <img src="Screenshots/Picture23.png"/></p>
<p align="center">All blocked images view page</p>

<p>For demonstration purposes, the status of "suspended" images is changed to "appealed". In the appealed images view page, all blocked images that were appealed are visible.</p>
<p align="center"> <img src="Screenshots/Picture24.png"/></p>
<p align="center">Appealed images view page</p>

<p>Clicking on an appealed image opens the appealed image view page. In this page, the updated image information along with comments is visible. The moderator can decide whether to unblock or delete the image.</p>
<p align="center"> <img src="Screenshots/Picture25.png"/></p>
<p align="center">Appealed image view page</p>

<p>After unblocking an image, the moderator is taken to the image view page. The moderator can delete comments left by other users that are no longer relevant after updating the image information.</p>
<p align="center"> <img src="Screenshots/Picture26.png"/></p>
<p align="center">Image view page (moderator)</p>

# Testing

A test plan is needed to define the order in which the tests are to be performed and the testing techniques and tools to be used. The following plan was followed during the development of the system:

1. Use the static code analysis tools ESLint and Prettier throughout the development. These tools help to avoid syntax errors, report unused variables and help to keep the structure of the code in order [10] [11].
2. Implementations of server-side methods write automated tests using xUnit together with Moq frameworks. Ensuring that changes made during system development do not break previously implemented functions.
3. Using the ThunderClient plugin in VSCode to create integration tests that will automatically check whether the server side is correctly processing the requests sent by the client.
4. At the end of the project development, manually perform full client-side testing to ensure that all use cases are implemented.

Testing criteria

1. Functional and non-functional requirements - Ensure that all functions of the system function as described in the Requirements Specification.
2. Code Quality - Use tools such as ESLint and Prettier to avoid redundant lines of code, code order and maintenance of best practice standards.
3. Cover the main parts of the system that are required for its operation with integration and unit tests.
4. Manual testing - To make sure that all use cases are realised and to ensure that users can use the system.
5. Compliance - Verify that the system meets all functional and non-functional requirements specified in the design specification to ensure the overall quality of the system.

Unit tests are written using xUnit and Moq. "xUnit is a popular .NET testing framework. "Moq is a library that can be used to create virtual objects and isolate the code under test. Using these technologies, 43 unit tests have been written

<p align="center"> <img src="Screenshots/TestingPicture1.png"/></p>
<p align="center">"Fine Code Coverage Unit Test Code Coverage Report"</p>

<p align="center"> <img src="Screenshots/TestingPicture2.png"/></p>
<p align="center">Fine Code Coverage Code Coverage Unit Tests Extended Report"</p>
