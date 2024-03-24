import Booking from "@/components/Booking/Booking";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3">
        <div>
          <Booking />
        </div>
        <div>
          Map
        </div>
      </div>
    </div>
  );
}
