export interface User {
    id: number;
    username: string;
    full_name: string;
    first_name: string;
    last_name: string;
    birth_date: string;
    joined_date: Date;
    email: string;
    image: string;
    address: string;
    phone: string;
    role: string;
    is_staff: boolean;
    is_active: boolean;
    is_superuser: boolean;
    slogan: string;
    parent_phone: string;
    whatsapp: string;
    stage: Stage | null;
}

export interface Stage {
    id: number;
    name: string;
}


export interface AuthState {
    user: User | null;
    selectedUser: User | null;
    access: string | null;
    refresh: string | null;

    users: User[];
    stages: Stage[];
    selectedStage: Stage | null;

    loading: boolean;
    error: string | null;
}