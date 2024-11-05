-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 03, 2024 at 10:14 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cvsuenrollmentsystem`
--

-- --------------------------------------------------------

--
-- Table structure for table `account`
--

CREATE TABLE `account` (
  `AccountID` int(11) NOT NULL,
  `Email` varchar(250) NOT NULL,
  `Password` varchar(250) NOT NULL,
  `Role` enum('Student','Enrollment Officer','Society Officer','Adviser','DCS Head','School Head') NOT NULL,
  `Status` enum('Active','Terminated') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `account`
--

INSERT INTO `account` (`AccountID`, `Email`, `Password`, `Role`, `Status`) VALUES
(1, 'admin@cvsu.edu.ph', 'admin', 'Enrollment Officer', 'Active');

-- --------------------------------------------------------

--
-- Table structure for table `admissionform`
--

CREATE TABLE `admissionform` (
  `AdmissionID` int(11) NOT NULL,
  `StudentID` int(11) DEFAULT NULL,
  `EmployeeID` int(11) DEFAULT NULL,
  `Branch` enum('CvSU - Bacoor') NOT NULL,
  `ExamControlNo` int(20) NOT NULL,
  `LRN` int(20) NOT NULL,
  `SHSStrand` varchar(250) DEFAULT NULL,
  `ZipCode` int(20) NOT NULL,
  `Religion` varchar(250) DEFAULT NULL,
  `Nationality` varchar(250) DEFAULT NULL,
  `CivilStatus` enum('Single','In a Relationship','Married','Widowed','Divorced','Separated','Annulled') DEFAULT NULL,
  `FatherName` varchar(250) DEFAULT NULL,
  `FatherContactNo` varchar(250) DEFAULT NULL,
  `FatherOccupation` varchar(250) DEFAULT NULL,
  `MotherName` varchar(250) DEFAULT NULL,
  `MotherContactNo` varchar(250) DEFAULT NULL,
  `MotherOccupation` varchar(250) DEFAULT NULL,
  `GuardianName` varchar(250) DEFAULT NULL,
  `GuardianRelationship` varchar(250) DEFAULT NULL,
  `GuardianContactNo` varchar(250) DEFAULT NULL,
  `GuardianOccupation` varchar(250) DEFAULT NULL,
  `NoOfSiblings` int(20) DEFAULT NULL,
  `BirthOrder` enum('Eldest','Second','Middle','Youngest','Only Child') NOT NULL,
  `MonthlyFamilyIncome` enum('below - 10,000','11,000 - 20,000','21,000 - 30,000','31,000 - 40,000','41,000 - 50,000','above 50,000') NOT NULL,
  `ElemSchoolName` varchar(250) DEFAULT NULL,
  `ElemSchoolAddress` varchar(250) DEFAULT NULL,
  `ElemYearGraduated` year(4) DEFAULT NULL,
  `SHSchoolName` varchar(250) DEFAULT NULL,
  `SHSchoolAddress` varchar(250) DEFAULT NULL,
  `SHYearGraduated` year(4) DEFAULT NULL,
  `VocationalSchoolName` varchar(250) DEFAULT NULL,
  `VocationalSchoolAddress` varchar(250) DEFAULT NULL,
  `VocationalYearGraduated` year(4) DEFAULT NULL,
  `TransfereeCollegeSchoolName` varchar(250) DEFAULT NULL,
  `TransfereeCollegeSchoolAddress` varchar(250) DEFAULT NULL,
  `TransfereeCollegeCourse` varchar(250) DEFAULT NULL,
  `SecondCourserCollegeSchoolName` varchar(250) DEFAULT NULL,
  `SecondCourserCollegeSchoolAddress` varchar(250) DEFAULT NULL,
  `SecondCourserCollegeCourse` varchar(250) DEFAULT NULL,
  `Medication` varchar(250) DEFAULT NULL,
  `MedicalHistory` varchar(250) DEFAULT NULL,
  `MedicalHistorySpecification` varchar(250) DEFAULT NULL,
  `DateOfExamAndTime` datetime DEFAULT NULL,
  `AssessedBy` varchar(250) DEFAULT NULL,
  `SubmissionSchedule` datetime DEFAULT NULL,
  `AdmissionStatus` enum('Pending','Approved','Rejected') NOT NULL DEFAULT 'Pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `advising`
--

CREATE TABLE `advising` (
  `AdvisingID` int(11) NOT NULL,
  `EmployeeID` int(11) DEFAULT NULL,
  `CourseChecklistID` int(11) DEFAULT NULL,
  `StudentCourseChecklistID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `classschedannouncement`
--

CREATE TABLE `classschedannouncement` (
  `AnnouncementID` int(11) NOT NULL,
  `SocietyOfficerID` int(11) DEFAULT NULL,
  `Message` text DEFAULT NULL,
  `YearLevel` enum('First Year','Second Year','Third Year','Mid-Year','Fourth Year') NOT NULL,
  `Semester` enum('First Semester','Second Semester') DEFAULT NULL,
  `SubjectCode` varchar(250) NOT NULL,
  `SubjectTitle` varchar(250) NOT NULL,
  `InstructorName` varchar(250) NOT NULL,
  `StartTime` time NOT NULL,
  `EndTime` time NOT NULL,
  `Day` enum('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday') NOT NULL,
  `DatePosted` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `coursechecklist`
--

CREATE TABLE `coursechecklist` (
  `CourseChecklistID` int(11) NOT NULL,
  `ProgramID` int(11) DEFAULT NULL,
  `YearLevel` enum('First Year','Second Year','Third Year','Mid-Year','Fourth Year') NOT NULL,
  `Semester` enum('First Semester','Second Semester') DEFAULT NULL,
  `CourseCode` varchar(250) NOT NULL,
  `CourseTitle` varchar(250) NOT NULL,
  `CreditUnitLec` int(11) NOT NULL,
  `CreditUnitLab` int(11) NOT NULL,
  `ContactHrsLec` int(11) NOT NULL,
  `ContactHrsLab` int(11) NOT NULL,
  `PreRequisite` varchar(250) DEFAULT NULL,
  `StartYear` year(4) DEFAULT NULL,
  `EndYear` year(4) DEFAULT NULL,
  `FinalGrade` float DEFAULT NULL,
  `InstructorName` varchar(250) DEFAULT NULL,
  `TotalCreditUnitLec` int(11) NOT NULL,
  `TotalCreditUnitLab` int(11) NOT NULL,
  `TotalContactHrsLec` int(11) NOT NULL,
  `TotalContactHrsLab` int(11) NOT NULL,
  `AdviserName` varchar(250) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `employee`
--

CREATE TABLE `employee` (
  `EmployeeID` int(11) NOT NULL,
  `ProgramID` int(11) DEFAULT NULL,
  `Firstname` varchar(250) NOT NULL,
  `Middlename` varchar(250) DEFAULT NULL,
  `Lastname` varchar(250) NOT NULL,
  `Email` varchar(250) NOT NULL,
  `PhoneNo` varchar(20) NOT NULL,
  `DOB` date NOT NULL,
  `CivilStatus` enum('Single','In a Relationship','Married','Widowed','Divorced','Separated','Annulled') NOT NULL,
  `Gender` enum('F','M') NOT NULL,
  `Address` varchar(250) NOT NULL,
  `EmpJobRole` enum('Adviser','DCS Head','School Head','Enrollment Officer') NOT NULL,
  `EmpStatus` enum('Employed','Resigned') NOT NULL,
  `RegStatus` enum('Pending','Accepted','Rejected') NOT NULL DEFAULT 'Pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employee`
--

INSERT INTO `employee` (`EmployeeID`, `ProgramID`, `Firstname`, `Middlename`, `Lastname`, `Email`, `PhoneNo`, `DOB`, `CivilStatus`, `Gender`, `Address`, `EmpJobRole`, `EmpStatus`, `RegStatus`) VALUES
(1, NULL, 'Admin', NULL, 'Enrollment Officer', 'admin@gmail.com', '09123456781', '1996-01-16', 'Single', 'F', 'Cavite', 'Enrollment Officer', 'Employed', 'Accepted');

-- --------------------------------------------------------

--
-- Table structure for table `enrollment`
--

CREATE TABLE `enrollment` (
  `EnrollmentID` int(11) NOT NULL,
  `EmployeeID` int(11) DEFAULT NULL,
  `PreEnrollmentID` int(11) DEFAULT NULL,
  `EnrollmentStatus` enum('Pending','Enrolled','Not Enrolled') NOT NULL DEFAULT 'Pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `noticeofadmission`
--

CREATE TABLE `noticeofadmission` (
  `NoticeOfAdmissionID` int(11) NOT NULL,
  `SlotConfirmationID` int(11) DEFAULT NULL,
  `IsDownloaded` tinyint(1) NOT NULL DEFAULT 0,
  `DateGenerated` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `preenrollment`
--

CREATE TABLE `preenrollment` (
  `PreEnrollmentID` int(11) NOT NULL,
  `StudentCourseChecklistID` int(11) DEFAULT NULL,
  `CourseChecklistID` int(11) DEFAULT NULL,
  `EmployeeID` int(11) DEFAULT NULL,
  `StartTime` time DEFAULT NULL,
  `EndTime` time DEFAULT NULL,
  `Day` enum('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday') DEFAULT NULL,
  `YearSection` varchar(20) DEFAULT NULL,
  `PreEnrollmentStatus` enum('Pending','Approved','Not Approved') NOT NULL DEFAULT 'Pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `program`
--

CREATE TABLE `program` (
  `ProgramID` int(11) NOT NULL,
  `ProgramCode` enum('BSCS','BSIT') NOT NULL,
  `ProgramName` enum('Bachelor of Science in Computer Science','Bachelor of Science in Information Technology') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `program`
--

INSERT INTO `program` (`ProgramID`, `ProgramCode`, `ProgramName`) VALUES
(1, 'BSCS', 'Bachelor of Science in Computer Science'),
(2, 'BSIT', 'Bachelor of Science in Information Technology');

-- --------------------------------------------------------

--
-- Table structure for table `requirements`
--

CREATE TABLE `requirements` (
  `RequirementsID` int(11) NOT NULL,
  `StudentID` int(11) DEFAULT NULL,
  `SocietyOfficerID` int(11) DEFAULT NULL,
  `SocFeePayment` enum('Pending','Paid','Unpaid') NOT NULL DEFAULT 'Pending',
  `AttendanceProof` varchar(3000) NOT NULL,
  `COG` varchar(3000) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `shiftingform`
--

CREATE TABLE `shiftingform` (
  `ShiftingID` int(11) NOT NULL,
  `StudentID` int(11) DEFAULT NULL,
  `EmployeeID` int(11) DEFAULT NULL,
  `PrevProgram` varchar(250) NOT NULL,
  `AcadYear` varchar(250) NOT NULL,
  `Reasons` text NOT NULL,
  `Date` date NOT NULL,
  `PrevProgramAdviser` varchar(250) NOT NULL,
  `CampusRegistrar` varchar(250) NOT NULL,
  `SchoolName` enum('CvSU - Bacoor') NOT NULL,
  `CampusAdministrator` varchar(250) NOT NULL,
  `SubmissionSchedule` datetime DEFAULT NULL,
  `ShiftingStatus` enum('Pending','Approved','Rejected') NOT NULL DEFAULT 'Pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `slotconfirmation`
--

CREATE TABLE `slotconfirmation` (
  `SlotConfirmationID` int(11) NOT NULL,
  `AdmissionID` int(11) DEFAULT NULL,
  `IsSlotConfirmed` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `societyofficer`
--

CREATE TABLE `societyofficer` (
  `SocietyOfficerID` int(11) NOT NULL,
  `ProgramID` int(11) DEFAULT NULL,
  `Firstname` varchar(250) NOT NULL,
  `Middlename` varchar(250) DEFAULT NULL,
  `Lastname` varchar(250) NOT NULL,
  `Email` varchar(250) NOT NULL,
  `PhoneNo` varchar(20) NOT NULL,
  `DOB` date NOT NULL,
  `Gender` enum('F','M') NOT NULL,
  `Address` varchar(250) NOT NULL,
  `Position` enum('President','Vice President','Secretary','Assistant Secretary','Treasurer','Assistant Treasurer','Business Manager','Auditor','P.R.O','GAD Representative','1st Year Chairperson','2nd Year Chairperson','3rd Year Chairperson','4th Year Chairperson','1st Year Senator','2nd Year Senator','3rd Year Senator','4th Year Senator') NOT NULL,
  `OfficerStatus` enum('Elected','Resigned') NOT NULL,
  `RegStatus` enum('Pending','Accepted','Rejected') NOT NULL DEFAULT 'Pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `student`
--

CREATE TABLE `student` (
  `StudentID` int(11) NOT NULL,
  `ProgramID` int(11) DEFAULT NULL,
  `CvSUStudentID` int(20) DEFAULT NULL,
  `Firstname` varchar(250) NOT NULL,
  `Middlename` varchar(250) DEFAULT NULL,
  `Lastname` varchar(250) NOT NULL,
  `Email` varchar(250) NOT NULL,
  `Gender` enum('F','M') NOT NULL,
  `Age` int(11) NOT NULL,
  `PhoneNo` varchar(20) NOT NULL,
  `Address` varchar(250) NOT NULL,
  `DOB` date NOT NULL,
  `StudentType` enum('Regular','Irregular','Transferee','Freshman','Shiftee') NOT NULL,
  `Year` enum('First Year','Second Year','Third Year','Mid-Year','Fourth Year') NOT NULL,
  `Semester` enum('First Semester','Second Semester') DEFAULT NULL,
  `LastSchoolAttended` varchar(250) DEFAULT NULL,
  `StdStatus` enum('Active','Inactive','Dropped','Graduated','Suspended','Withdrawn','On Leave','Alumni','Transfer','Prospective') NOT NULL,
  `RegStatus` enum('Pending','Accepted','Rejected') NOT NULL DEFAULT 'Pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `studentcoursechecklist`
--

CREATE TABLE `studentcoursechecklist` (
  `StudentCourseChecklistID` int(11) NOT NULL,
  `StudentID` int(11) DEFAULT NULL,
  `CourseChecklistID` int(11) DEFAULT NULL,
  `SocietyOfficerID` int(11) DEFAULT NULL,
  `StdChecklistStatus` enum('Pending','Verified','Rejected') NOT NULL DEFAULT 'Pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `account`
--
ALTER TABLE `account`
  ADD PRIMARY KEY (`AccountID`),
  ADD UNIQUE KEY `Email` (`Email`);

--
-- Indexes for table `admissionform`
--
ALTER TABLE `admissionform`
  ADD PRIMARY KEY (`AdmissionID`),
  ADD KEY `StudentID` (`StudentID`),
  ADD KEY `EmployeeID` (`EmployeeID`);

--
-- Indexes for table `advising`
--
ALTER TABLE `advising`
  ADD PRIMARY KEY (`AdvisingID`),
  ADD KEY `EmployeeID` (`EmployeeID`),
  ADD KEY `CourseChecklistID` (`CourseChecklistID`),
  ADD KEY `StudentCourseChecklistID` (`StudentCourseChecklistID`);

--
-- Indexes for table `classschedannouncement`
--
ALTER TABLE `classschedannouncement`
  ADD PRIMARY KEY (`AnnouncementID`),
  ADD KEY `SocietyOfficerID` (`SocietyOfficerID`);

--
-- Indexes for table `coursechecklist`
--
ALTER TABLE `coursechecklist`
  ADD PRIMARY KEY (`CourseChecklistID`),
  ADD KEY `ProgramID` (`ProgramID`);

--
-- Indexes for table `employee`
--
ALTER TABLE `employee`
  ADD PRIMARY KEY (`EmployeeID`),
  ADD UNIQUE KEY `Email` (`Email`),
  ADD UNIQUE KEY `PhoneNo` (`PhoneNo`),
  ADD KEY `ProgramID_FK` (`ProgramID`);

--
-- Indexes for table `enrollment`
--
ALTER TABLE `enrollment`
  ADD PRIMARY KEY (`EnrollmentID`),
  ADD KEY `EmployeeID` (`EmployeeID`),
  ADD KEY `PreEnrollmentID` (`PreEnrollmentID`);

--
-- Indexes for table `noticeofadmission`
--
ALTER TABLE `noticeofadmission`
  ADD PRIMARY KEY (`NoticeOfAdmissionID`),
  ADD KEY `SlotConfirmationID` (`SlotConfirmationID`);

--
-- Indexes for table `preenrollment`
--
ALTER TABLE `preenrollment`
  ADD PRIMARY KEY (`PreEnrollmentID`),
  ADD KEY `StudentCourseChecklistID` (`StudentCourseChecklistID`),
  ADD KEY `CourseChecklistID` (`CourseChecklistID`),
  ADD KEY `EmployeeID` (`EmployeeID`);

--
-- Indexes for table `program`
--
ALTER TABLE `program`
  ADD PRIMARY KEY (`ProgramID`),
  ADD UNIQUE KEY `ProgramCode` (`ProgramCode`),
  ADD UNIQUE KEY `ProgramName` (`ProgramName`);

--
-- Indexes for table `requirements`
--
ALTER TABLE `requirements`
  ADD PRIMARY KEY (`RequirementsID`),
  ADD KEY `StudentID` (`StudentID`),
  ADD KEY `SocietyOfficerID` (`SocietyOfficerID`);

--
-- Indexes for table `shiftingform`
--
ALTER TABLE `shiftingform`
  ADD PRIMARY KEY (`ShiftingID`),
  ADD KEY `StudentID` (`StudentID`),
  ADD KEY `EmployeeID` (`EmployeeID`);

--
-- Indexes for table `slotconfirmation`
--
ALTER TABLE `slotconfirmation`
  ADD PRIMARY KEY (`SlotConfirmationID`),
  ADD KEY `AdmissionID` (`AdmissionID`);

--
-- Indexes for table `societyofficer`
--
ALTER TABLE `societyofficer`
  ADD PRIMARY KEY (`SocietyOfficerID`),
  ADD UNIQUE KEY `Email` (`Email`),
  ADD UNIQUE KEY `PhoneNo` (`PhoneNo`),
  ADD KEY `ProgramID` (`ProgramID`);

--
-- Indexes for table `student`
--
ALTER TABLE `student`
  ADD PRIMARY KEY (`StudentID`),
  ADD UNIQUE KEY `Email` (`Email`),
  ADD UNIQUE KEY `CvSUStudentID` (`CvSUStudentID`),
  ADD KEY `ProgramID` (`ProgramID`);

--
-- Indexes for table `studentcoursechecklist`
--
ALTER TABLE `studentcoursechecklist`
  ADD PRIMARY KEY (`StudentCourseChecklistID`),
  ADD KEY `StudentID` (`StudentID`),
  ADD KEY `CourseChecklistID` (`CourseChecklistID`),
  ADD KEY `SocietyOfficerID` (`SocietyOfficerID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `classschedannouncement`
--
ALTER TABLE `classschedannouncement`
  MODIFY `AnnouncementID` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `admissionform`
--
ALTER TABLE `admissionform`
  ADD CONSTRAINT `admissionform_ibfk_1` FOREIGN KEY (`StudentID`) REFERENCES `student` (`StudentID`),
  ADD CONSTRAINT `admissionform_ibfk_2` FOREIGN KEY (`EmployeeID`) REFERENCES `employee` (`EmployeeID`);

--
-- Constraints for table `advising`
--
ALTER TABLE `advising`
  ADD CONSTRAINT `advising_ibfk_1` FOREIGN KEY (`EmployeeID`) REFERENCES `employee` (`EmployeeID`),
  ADD CONSTRAINT `advising_ibfk_2` FOREIGN KEY (`CourseChecklistID`) REFERENCES `coursechecklist` (`CourseChecklistID`),
  ADD CONSTRAINT `advising_ibfk_3` FOREIGN KEY (`StudentCourseChecklistID`) REFERENCES `studentcoursechecklist` (`StudentCourseChecklistID`);

--
-- Constraints for table `classschedannouncement`
--
ALTER TABLE `classschedannouncement`
  ADD CONSTRAINT `classschedannouncement_ibfk_1` FOREIGN KEY (`SocietyOfficerID`) REFERENCES `societyofficer` (`SocietyOfficerID`);

--
-- Constraints for table `coursechecklist`
--
ALTER TABLE `coursechecklist`
  ADD CONSTRAINT `coursechecklist_ibfk_1` FOREIGN KEY (`ProgramID`) REFERENCES `program` (`ProgramID`);

--
-- Constraints for table `employee`
--
ALTER TABLE `employee`
  ADD CONSTRAINT `ProgramID_FK` FOREIGN KEY (`ProgramID`) REFERENCES `program` (`ProgramID`);

--
-- Constraints for table `enrollment`
--
ALTER TABLE `enrollment`
  ADD CONSTRAINT `enrollment_ibfk_1` FOREIGN KEY (`EmployeeID`) REFERENCES `employee` (`EmployeeID`),
  ADD CONSTRAINT `enrollment_ibfk_2` FOREIGN KEY (`PreEnrollmentID`) REFERENCES `preenrollment` (`PreEnrollmentID`);

--
-- Constraints for table `noticeofadmission`
--
ALTER TABLE `noticeofadmission`
  ADD CONSTRAINT `noticeofadmission_ibfk_1` FOREIGN KEY (`SlotConfirmationID`) REFERENCES `slotconfirmation` (`SlotConfirmationID`);

--
-- Constraints for table `preenrollment`
--
ALTER TABLE `preenrollment`
  ADD CONSTRAINT `preenrollment_ibfk_1` FOREIGN KEY (`StudentCourseChecklistID`) REFERENCES `studentcoursechecklist` (`StudentCourseChecklistID`),
  ADD CONSTRAINT `preenrollment_ibfk_2` FOREIGN KEY (`CourseChecklistID`) REFERENCES `coursechecklist` (`CourseChecklistID`),
  ADD CONSTRAINT `preenrollment_ibfk_3` FOREIGN KEY (`EmployeeID`) REFERENCES `employee` (`EmployeeID`);

--
-- Constraints for table `requirements`
--
ALTER TABLE `requirements`
  ADD CONSTRAINT `requirements_ibfk_1` FOREIGN KEY (`StudentID`) REFERENCES `student` (`StudentID`),
  ADD CONSTRAINT `requirements_ibfk_2` FOREIGN KEY (`SocietyOfficerID`) REFERENCES `societyofficer` (`SocietyOfficerID`);

--
-- Constraints for table `shiftingform`
--
ALTER TABLE `shiftingform`
  ADD CONSTRAINT `shiftingform_ibfk_1` FOREIGN KEY (`StudentID`) REFERENCES `student` (`StudentID`),
  ADD CONSTRAINT `shiftingform_ibfk_2` FOREIGN KEY (`EmployeeID`) REFERENCES `employee` (`EmployeeID`);

--
-- Constraints for table `slotconfirmation`
--
ALTER TABLE `slotconfirmation`
  ADD CONSTRAINT `slotconfirmation_ibfk_1` FOREIGN KEY (`AdmissionID`) REFERENCES `admissionform` (`AdmissionID`);

--
-- Constraints for table `societyofficer`
--
ALTER TABLE `societyofficer`
  ADD CONSTRAINT `societyofficer_ibfk_1` FOREIGN KEY (`ProgramID`) REFERENCES `program` (`ProgramID`);

--
-- Constraints for table `student`
--
ALTER TABLE `student`
  ADD CONSTRAINT `student_ibfk_2` FOREIGN KEY (`ProgramID`) REFERENCES `program` (`ProgramID`);

--
-- Constraints for table `studentcoursechecklist`
--
ALTER TABLE `studentcoursechecklist`
  ADD CONSTRAINT `studentcoursechecklist_ibfk_1` FOREIGN KEY (`StudentID`) REFERENCES `student` (`StudentID`),
  ADD CONSTRAINT `studentcoursechecklist_ibfk_2` FOREIGN KEY (`CourseChecklistID`) REFERENCES `coursechecklist` (`CourseChecklistID`),
  ADD CONSTRAINT `studentcoursechecklist_ibfk_3` FOREIGN KEY (`SocietyOfficerID`) REFERENCES `societyofficer` (`SocietyOfficerID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
