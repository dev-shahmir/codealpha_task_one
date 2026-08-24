export default function AuthLayout({ eyebrow, title, children, image }) {
  return (
    <div className="grid md:grid-cols-2 min-h-[calc(100vh-76px-28px)]">
      <div className="flex items-center justify-center py-16 px-6">
        <div className="w-full max-w-sm">
          {eyebrow && <span className="eyebrow mb-3 block">{eyebrow}</span>}
          <h1 className="font-display text-4xl mb-8">{title}</h1>
          {children}
        </div>
      </div>
      <div className="hidden md:block relative">
        <img
          src={image}
          alt="Urban Thread campaign"
          className="absolute inset-0 w-full h-full object-cover grayscale"
        />
      </div>
    </div>
  );
}
