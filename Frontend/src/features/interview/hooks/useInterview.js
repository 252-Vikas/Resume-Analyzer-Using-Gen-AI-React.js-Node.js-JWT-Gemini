
import {
    getAllInterviewReports,
    generateInterviewReport,
    getInterviewReportById,
    generateResumePdf
} from "../services/interview.api";

import { useContext, useEffect } from "react";
import { InterviewContext } from "../interview.context";
import { useParams } from "react-router";


export const useInterview = () => {

    const context = useContext(InterviewContext);
    const { interviewId } = useParams();

    if (!context) {
        throw new Error(
            "useInterview must be used within an InterviewProvider"
        );
    }

    const {
        loading,
        setLoading,
        report,
        setReport,
        reports,
        setReports
    } = context;


    // Generate Interview Report
    const generateReport = async ({
        jobDescription,
        selfDescription,
        resumeFile
    }) => {

        setLoading(true);

        try {

            // Send all required information to backend
            const response = await generateInterviewReport({
                jobDescription,
                selfDescription,
                resumeFile
            });

            console.log("Generate report response:", response);

            if (!response) {
                throw new Error(
                    "No response received from server"
                );
            }

            if (!response.interviewReport) {
                throw new Error(
                    "Interview report was not returned by server"
                );
            }

            // Store report in context
            setReport(response.interviewReport);

            // Return report to Home.jsx
            return response.interviewReport;

        } catch (error) {

            console.error(
                "Failed to generate interview report:",
                error
            );

            // Important: re-throw the error
            // so Home.jsx can catch it.
            throw error;

        } finally {

            setLoading(false);

        }
    };


    // Get single report
    const getReportById = async (interviewId) => {

        setLoading(true);

        try {

            const response =
                await getInterviewReportById(interviewId);

            console.log("Report by ID response:", response);

            if (!response?.interviewReport) {
                throw new Error(
                    "Interview report not found"
                );
            }

            setReport(response.interviewReport);

            return response.interviewReport;

        } catch (error) {

            console.error(
                "Failed to get interview report:",
                error
            );

            throw error;

        } finally {

            setLoading(false);

        }
    };


    // Get all reports
    const getReports = async () => {

        setLoading(true);

        try {

            const response =
                await getAllInterviewReports();

            console.log("All reports response:", response);

            if (!response?.interviewReports) {
                throw new Error(
                    "Interview reports not found"
                );
            }

            setReports(response.interviewReports);

            return response.interviewReports;

        } catch (error) {

            console.error(
                "Failed to get interview reports:",
                error
            );

            throw error;

        } finally {

            setLoading(false);

        }
    };


    // Generate Resume PDF
    const getResumePdf = async (interviewReportId) => {

        setLoading(true);

        try {

            const response =
                await generateResumePdf({
                    interviewReportId
                });

            const url = window.URL.createObjectURL(
                new Blob(
                    [response],
                    { type: "application/pdf" }
                )
            );

            const link = document.createElement("a");

            link.href = url;

            link.setAttribute(
                "download",
                `resume_${interviewReportId}.pdf`
            );

            document.body.appendChild(link);

            link.click();

            link.remove();

            window.URL.revokeObjectURL(url);

        } catch (error) {

            console.error(
                "Failed to generate resume PDF:",
                error
            );

            throw error;

        } finally {

            setLoading(false);

        }
    };


    // Load reports when component loads
    useEffect(() => {

        if (interviewId) {

            getReportById(interviewId);

        } else {

            getReports();

        }

    }, [interviewId]);


    return {
        loading,
        report,
        reports,
        generateReport,
        getReportById,
        getReports,
        getResumePdf
    };
};


