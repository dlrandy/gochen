import { magicAdmin } from "../../../lib/magic/server";
import { removeTokenCookie } from "../../../lib/cookies";
import { verifyToken } from "../../../lib/utils";
import { NextApiRequest, NextApiResponse } from 'next';

export default async function logout(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (!req.cookies.token)
            return res.status(401).json({ message: "User is not logged in" });
        const token = req.cookies.token;

        const userId = await verifyToken(token);
        removeTokenCookie(res);
        try {
            if (userId) {

                await magicAdmin.users.logoutByIssuer(userId);
            }
        } catch (error) {
            console.error("Error occurred while logging out magic user", error);
        }
        //redirects user to login page
        res.writeHead(302, { Location: "/youflix/login" });
        res.end();
    } catch (error) {
        console.error({ error });
        res.status(401).json({ message: "User is not logged in" });
    }
}