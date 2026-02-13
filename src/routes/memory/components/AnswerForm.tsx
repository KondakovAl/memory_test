import { type RefObject } from "react";
import { Stack, TextInput, Button } from "@mantine/core";

type AnswerFormProps = {
  value: string;
  onChange: (value: string) => void;
  onCheck: () => void;
  inputRef?: RefObject<HTMLInputElement | null>;
};

export function AnswerForm({
  value,
  onChange,
  onCheck,
  inputRef,
}: AnswerFormProps) {
  return (
    <Stack gap="md">
      <TextInput
        ref={inputRef as RefObject<HTMLInputElement>}
        label="Сумма двух цифр в красных клетках"
        placeholder="Введите число"
        type="number"
        value={value}
        onChange={(e) => onChange(e.currentTarget.value)}
        onKeyDown={(e) => e.key === "Enter" && onCheck()}
        onBlur={() => inputRef?.current?.focus()}
      />
      <Button onClick={onCheck}>Далее</Button>
    </Stack>
  );
}
