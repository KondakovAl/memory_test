import { Link } from "@tanstack/react-router";
import { Anchor } from "@mantine/core";

type BackLinkProps = {
  to: string;
  title: string;
};

export function BackLink({ to, title }: BackLinkProps) {
  return (
    <Link
      to={to}
      style={{
        alignSelf: "flex-start",
        color: "inherit",
        textDecoration: "none",
      }}
    >
      <Anchor size="sm" c="dimmed">
        ← {title}
      </Anchor>
    </Link>
  );
}
