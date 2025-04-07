import type { Service } from "../livestream";
import { ServiceCard } from "./service-card";

interface ServicesDisplayProps {
  services: Service[];
}

// CSS animation for service cards
const serviceAnimationStyle = `
  /* Service card animations */
  @keyframes slideIn {
    from {
      transform: translateY(100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  .service-card {
    animation: slideIn 0.5s ease-out forwards;
  }

  /* Pulse animation for discount badge */
  @keyframes pulsate {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
    100% {
      transform: scale(1);
    }
  }

  .discount-badge {
    animation: pulsate 2s infinite ease-in-out;
  }

  /* Horizontal scroll for services */
  .services-container {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
  }
  
  .services-container::-webkit-scrollbar {
    display: none;  /* Chrome, Safari, Opera */
  }
`;

export function ServicesDisplay({ services }: ServicesDisplayProps) {
  if (services.length === 0) return null;

  return (
    <>
      <style>{serviceAnimationStyle}</style>
      <div className="absolute bottom-4 left-0 right-0 px-4 z-10">
        <div className="services-container flex overflow-x-auto space-x-3 pb-2">
          {services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>
      </div>
    </>
  );
}
