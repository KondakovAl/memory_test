import { Button } from "@mantine/core";

type NextButtonProps = {
  onNext: () => void;
  label?: string;
};

export function NextButton({ onNext, label = "Далее" }: NextButtonProps) {
  return <Button onClick={onNext}>{label}</Button>;
}
