import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Label } from "../ui/label";
import { Agency } from "@/lib/dashboard-mgt-bff";
import { Mail, Phone, MapPin, Building2 } from "lucide-react";

interface AgencyDisplayProps {
  agency: Agency;
}

export default function AgencyDisplay({ agency }: AgencyDisplayProps) {
  const fullAddress = `${agency.address.number} ${agency.address.street}, ${agency.address.city} ${agency.address.zipCode}, ${agency.address.country}`;

  return (
    <div className="flex flex-col gap-6 max-w-6xl w-full px-4 sm:px-6">
      {/* Agency Name */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-muted-foreground" />
            <CardTitle className="text-xl sm:text-2xl">{agency.name}</CardTitle>
          </div>
          <CardDescription>Agency Information</CardDescription>
        </CardHeader>
      </Card>

      {/* Contact Information and Address - Side by side on larger screens */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">
              Contact Information
            </CardTitle>
            <CardDescription>Contact details for the agency</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <Label className="text-xs text-muted-foreground">Email</Label>
                <p className="text-sm font-medium break-words">
                  {agency.contactMail}
                </p>
              </div>
            </div>
            {agency.contactPhone && (
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <Label className="text-xs text-muted-foreground">
                    Phone Number
                  </Label>
                  <p className="text-sm font-medium break-words">
                    {agency.contactPhone}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Address */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Address</CardTitle>
            <CardDescription>Physical location of the agency</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium break-words">{fullAddress}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
