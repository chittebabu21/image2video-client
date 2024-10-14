import { User } from "./user";

export interface Video {
    video_id: number;
    video_url: string;
    generation_id: string;
    generated_on: Date;
    user_id: number | null;
    user?: User;
}
