import {atom} from "recoil"
import { FriendModel } from "../../models/component.model";
//create separate file atoms.ts in src
export const userDataState = atom({
    key: 'userDataState',
    default: {
        _id: '',
        name: '',
        email: '',
        avatar: '',
        bio:'',
        role: '',
    },
  });

export const selectedChatUserState = atom<FriendModel | null>({
    key: 'selectedChatUserState',
    default: null,
  });