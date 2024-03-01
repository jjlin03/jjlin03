> **GETTING STARTED:** You should likely start with the `/mock` folder from your solution code for the mock gearup.

# Project Details

Project Name: Mock
Github Usernames: kczhang, jlin142
Total Estimated Time: 35 hours
Github Link: https://github.com/cs0320-s24/mock-jlin142-kczheng.git

# Design Choices

The REPL class handles the shared states and stores many different histories to be displayed.
The REPLInput class handles the data being submitted and the correspodning output to
display given the command. And the REPLHistory class displays all the command and outputs
based on the given mode. Mocking is also used to mock searches such that the results of the
queries are predetermined, and search commands must be within the predefined mocking data.

# Errors/Bugs

There are currently no known errors/bugs.

# Tests

The testing suite meticulously assesses a web-based REPL (Read-Eval-Print Loop) interface,
focusing on user authentication, data management, and system interaction. It ensures smooth
transitions in page states upon user login and validates the accurate loading and viewing
of data from various sources. Additionally, the suite examines the effectiveness of data
searching functionalities, mode switching capabilities, and the seamless transition between
different data files. Crucially, it rigorously tests the logout feature to guarantee the
interface resets appropriately for new sessions. By evaluating these key functionalities,
the suite aims to uphold the reliability, accuracy, and user-friendliness of the REPL
interface, facilitating efficient interaction with the underlying data management system.

# How to

Start the local host by running "npm start" and then going to the local host link. After
logging in, one can load data by submitting "load_file <\_**\_>" by putting the file name
in the <>. One can view the data by submitting "view". One can search or query data by
submitting "search <**> <**>" with the first value being the column parameter, which is
optional, and second being the value parameter. One can also switch from modes by
submitting "mode \_**" by typing brief or verbose.

# Collaboration

_(state all of your sources of collaboration past your project partner. Please refer to the course's collaboration policy for any further questions.)_
