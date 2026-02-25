import { useState, ChangeEvent } from 'react';

export function useForm(initialValues: Record<string, string>) {
    const [values, setValues] = useState(initialValues);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { value, name } = event.target;
        setValues((prev) => ({ ...prev, [name]: value }));
    };

    return { values, handleChange, setValues };
}