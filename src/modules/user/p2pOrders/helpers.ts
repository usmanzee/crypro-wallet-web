import { P2POrder, P2PChat } from "./types";

export const insertOrUpdate = (list: P2POrder[], order: P2POrder): P2POrder[] => {
    const { id } = order;
    const index = list.findIndex((value: P2POrder) => value.id === id);

    if (index === -1) {
        return [{...order}, ...list];
    }

    return list.map(item => {
        if (item.id === order.id) {
            return {...order};
        }

        return item;
    });
};

export const insertIfNotExisted = (list: P2POrder[], order: P2POrder): P2POrder[] => {
    const index = list.findIndex((value: P2POrder) => value.id === order.id);

    return (index === -1) ? [{...order}, ...list] : [...list];
};

export const insertChatIfNotExisted = (list: P2PChat[], chat: P2PChat): P2PChat[] => {
    const index = list.findIndex((value: P2PChat) => value.id === chat.id);

    return (index === -1) ? [...list, {...chat},] : [...list];
};