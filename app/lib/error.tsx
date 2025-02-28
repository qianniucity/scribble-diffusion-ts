export default function Footer({ error }: { error: string | null }) {
  if (!error) return null;

  return (
    <div className="mx-auto w-full" >
      {error && <p className="bold text-red-500 pb-5" > {error} </p>}
    </div>
  );
}
