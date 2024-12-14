import React from 'react'; 
import { render, screen, fireEvent, waitFor } from '@testing-library/react'; 
import Header from '/src/components/Header';  
import { BrowserRouter as Router } from 'react-router-dom';  


jest.mock('/src/components/SidebarMenu', () => () => <div data-testid="sidebar-menu">Sidebar Menu</div>);

describe('Header Component', () => { 
    let setSideBarMock; 

    beforeEach(() => {
        setSideBarMock = jest.fn(); 
    });


    test('Renders Header correctly', () => {
        render(
            <Router>  
                <Header SideBar={false} setSideBar={setSideBarMock} /> 
            </Router>
        );

        const menuIcon = screen.getByAltText(/menu-icon/i);
        expect(menuIcon).toBeInTheDocument();

        const logo = screen.getByAltText(/cvsu logo/i);
        expect(logo).toBeInTheDocument(); 

        expect(screen.getByText(/CAVITE STATE UNIVERSITY/i)).toBeInTheDocument();  
        expect(screen.getByText(/BACOOR CAMPUS/i)).toBeInTheDocument();  

        const departmentElements = screen.getAllByText(/DEPARTMENT OF COMPUTER STUDIES/i);
        expect(departmentElements.length).toBeGreaterThan(0); 

        expect(screen.getByText(/About/)).toBeInTheDocument();  
        expect(screen.getByText(/Admissions/)).toBeInTheDocument();  
        expect(screen.getByText(/Contact/)).toBeInTheDocument();  
        expect(screen.getByText(/Sign In/)).toBeInTheDocument();  
    });


    test('Dropdown displays correct options for About', () => {
        render(
            <Router>
                <Header SideBar={false} setSideBar={setSideBarMock} />
            </Router>
        );

        const aboutNavItem = screen.getByText(/About/);

        fireEvent.mouseOver(aboutNavItem);

        expect(screen.getByText(/History of CvSU/)).toBeInTheDocument();
        expect(screen.getByText(/Mission, Vision, and Core Values/)).toBeInTheDocument();
        expect(screen.getByText(/Department of Computer Studies/)).toBeInTheDocument();
        expect(screen.getByText(/Computer Studies Society Officers/)).toBeInTheDocument();
    });


    test('Dropdown displays correct options for Admissions', () => {
        render(
            <Router>
                <Header SideBar={false} setSideBar={setSideBarMock} />
            </Router>
        );

        const admissionsNavItem = screen.getByText(/Admissions/);

        fireEvent.mouseOver(admissionsNavItem);

        expect(screen.getByText(/Apply/)).toBeInTheDocument();
        expect(screen.getByText(/Enrollment FAQs/)).toBeInTheDocument();
        expect(screen.getByText(/Undergraduate Programs/)).toBeInTheDocument();
    });
    

    test('Navigates to the correct route when a link is clicked', () => {
        render(
            <Router>
                <Header SideBar={false} setSideBar={setSideBarMock} />
            </Router>
        );
      
        const mainpageLink = screen.getByAltText(/cvsu logo/);
        fireEvent.click(mainpageLink);
        expect(window.location.pathname).toBe('/MainPage');

        const historyLink = screen.getByText(/History of CvSU/);
        fireEvent.click(historyLink);
        expect(window.location.pathname).toBe('/CvsuHistory');

        const missionvisionLink = screen.getByText(/Mission, Vision, and Core Values/);
        fireEvent.click(missionvisionLink);
        expect(window.location.pathname).toBe('/MissionVision');

        const dcsLink = screen.getByText(/Department of Computer Studies/);
        fireEvent.click(dcsLink);
        expect(window.location.pathname).toBe('/DcsPage');

        const csLink = screen.getByText(/Computer Studies Society Officers/);
        fireEvent.click(csLink);
        expect(window.location.pathname).toBe('/SocOff');

        const contactLink = screen.getByText(/Contact/);
        fireEvent.click(contactLink);
        expect(window.location.pathname).toBe('/MainPage'); 
        expect(window.location.hash).toBe('#contact');      

        const signinLink = screen.getByText(/Sign In/);
        fireEvent.click(signinLink);
        expect(window.location.pathname).toBe('/LoginPage');
    });


    test('Toggles the sidebar on menu button click', async () => {
        let SideBar = false;  

        const { rerender } = render(
            <Router>
                <Header SideBar={SideBar} setSideBar={setSideBarMock} />  
            </Router>
        );

        const menuButton = screen.getByAltText(/menu-icon/i);

        fireEvent.click(menuButton);

        await waitFor(() => expect(setSideBarMock).toHaveBeenCalledWith(true));

        SideBar = true;
        rerender(  
            <Router>
                <Header SideBar={SideBar} setSideBar={setSideBarMock} />
            </Router>
        );

        fireEvent.click(menuButton);

        await waitFor(() => expect(setSideBarMock).toHaveBeenCalledWith(false));

        expect(setSideBarMock).toHaveBeenCalledTimes(2);
    });


    test('Renders SidebarMenu when SideBar is true', () => {
        render(
            <Router>
                <Header SideBar={true} setSideBar={setSideBarMock} />  
            </Router>
        );

        const sidebarMenu = screen.getByTestId('sidebar-menu');
        expect(sidebarMenu).toBeInTheDocument();  
    });
});
