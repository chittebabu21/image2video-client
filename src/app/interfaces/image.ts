import { User } from "./user";

export interface Image {
    image_id: number;
    image_url: string;
    image_size?: string | null;
    added_on: Date;
    user_id: number;
    user?: User
}
