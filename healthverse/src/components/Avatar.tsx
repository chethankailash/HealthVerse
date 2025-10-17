export default function Avatar({ email }: { email: string }) {
  const letter = email ? email.charAt(0).toUpperCase() : "U";
  return (
    <div className="w-10 h-10 flex items-center justify-center bg-indigo-600 text-white font-bold rounded-full">
      {letter}
    </div>
  );
}
