interface Props {
  family: string;
  loaded: boolean;
  onHover: (family: string) => void;
}

export default function FontPreviewItem({ family, loaded, onHover }: Props) {
  return (
    <div
      onMouseEnter={() => onHover(family)}
      className="w-full truncate"
      style={{
        fontFamily: loaded ? family : "Inter, sans-serif",
      }}
    >
      {family}
    </div>
  );
}
