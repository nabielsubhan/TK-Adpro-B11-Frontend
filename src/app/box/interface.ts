import Item from "../item/interface";

interface Box {
    id: string;
    name: string;
    description: string;
    picture: string;
    price: number;
    items: Item[];
}

export default Box;