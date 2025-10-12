import { CountryData } from "@/lib/types";

interface CountrySelectorProps {
  countries: CountryData[];
  selectedCountry: string;
  onSelectCountry: (country: string) => void;
}

export default function CountrySelector({
  countries,
  selectedCountry,
  onSelectCountry,
}: CountrySelectorProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <label
        htmlFor="country-select"
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        Select Country
      </label>
      <select
        id="country-select"
        value={selectedCountry}
        onChange={(e) => onSelectCountry(e.target.value)}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg font-medium text-gray-900"
      >
        {countries.map((country) => (
          <option key={country.country} value={country.country}>
            {country.country}
          </option>
        ))}
      </select>
    </div>
  );
}

