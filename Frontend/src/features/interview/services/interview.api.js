

import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true,
});


/**
 * @description
 * Service to generate interview report based on
 * job title, user self description, resume and job description.
 */
export const generateInterviewReport = async ({
    title,
    jobDescription,
    selfDescription,
    resumeFile,
}) => {

    try {

        const formData = new FormData();

        // Job title is required by backend
        formData.append(
            "title",
            title
        );

        formData.append(
            "jobDescription",
            jobDescription
        );

        formData.append(
            "selfDescription",
            selfDescription
        );

        // Only append resume if user selected one
        if (resumeFile) {
            formData.append(
                "resume",
                resumeFile
            );
        }

        // Debug: check what is being sent
        console.log("Interview FormData:");

        for (const [key, value] of formData.entries()) {
            console.log(key, value);
        }

        const response = await api.post(
            "/api/interview/",
            formData
        );

        console.log(
           "Interview report response:",
            response.data
        );

        return response.data;

    } catch (error) {

        console.error(
            "Interview API Error:",
           error.response?.data || error.message
       );

        throw error;
    }
};


/**
 * @description
 * Service to get interview report by interviewId.
 */
export const getInterviewReportById = async (
    interviewId
) => {

    try {

        const response = await api.get(
            `/api/interview/report/${interviewId}`
        );

        return response.data;

    } catch (error) {

        console.error(
            "Get Interview Report Error:",
            error.response?.data || error.message
        );

        throw error;
    }
};


/**
 * @description
 * Service to get all interview reports
 * of logged in user.
 */
export const getAllInterviewReports = async () => {

    try {

        const response = await api.get(
            "/api/interview/"
        );

        return response.data;

    } catch (error) {

        console.error(
            "Get Interview Reports Error:",
            error.response?.data || error.message
        );

        throw error;
    }
};


/**
 * @description
 * Service to generate resume PDF based on
 * interview report.
 */
export const generateResumePdf = async ({
    interviewReportId
}) => {

    try {

        const response = await api.post(
            `/api/interview/resume/pdf/${interviewReportId}`,
            null,
            {
                responseType: "blob",
            }
        );

        return response.data;

    } catch (error) {

        console.error(
            "Generate Resume PDF Error:",
            error.response?.data || error.message
        );

        throw error;
    }
};

    











