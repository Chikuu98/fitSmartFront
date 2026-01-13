import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Search,
  MapPin,
  Globe,
  User,
  Star,
  Calendar,
  MessageCircle,
} from "lucide-react";
import CustomSelect from "../../../components/ui/customSelect";
import { Button } from "../../../components/ui/button";
import StarRating from "../../../components/ui/starRating";
import { getMentorList } from "../../../api/endpoints/mentors";
import { languageOptions } from "../../../utils/languageOptions";
import { countryOptions } from "../../../utils/countryOptions";
import type { Mentor, MentorListFilters } from "../../../interfaces/mentor";
import type { RootState } from "../../../store/store";

interface Option {
  value: string;
  label: string;
}

const SearchForMentor: React.FC = () => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);

  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedCountry, setSelectedCountry] = useState<Option | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<Option | null>(null);

  const fetchMentors = async (filters?: MentorListFilters) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMentorList(filters);
      setMentors(data);
    } catch (err) {
      setError("Failed to fetch mentors. Please try again.");
      console.error("Error fetching mentors:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMentors();
  }, []);

  const handleSearch = () => {
    const filters: MentorListFilters = {};

    if (selectedCountry) {
      filters.country = selectedCountry.value;
    }

    if (selectedLanguage) {
      filters.language = selectedLanguage.value;
    }

    fetchMentors(filters);
  };

  const clearFilters = () => {
    setSelectedCountry(null);
    setSelectedLanguage(null);
    setSearchTerm("");
    fetchMentors();
  };

  const filteredMentors = mentors.filter((mentor) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      mentor.name.toLowerCase().includes(searchLower) ||
      mentor.mentorDetail?.expertise?.toLowerCase().includes(searchLower) ||
      mentor.country.toLowerCase().includes(searchLower) ||
      mentor.language.toLowerCase().includes(searchLower)
    );
  });

  const handleBookMentor = (mentor_id: number) => {
    navigate(`/member/mentor-slots/${mentor_id}`);
  };

  if (user?.role !== "member") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Only members can access this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen transition-colors">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Find Your Perfect Mentor
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Discover experienced mentors who can guide you on your fitness
            journey
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search by name, expertise..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 border border-gray-300 dark:border-gray-600 rounded-lg 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:ring-1 focus:ring-orange-500 focus:border-transparent focus:outline-none
                         placeholder-gray-500 dark:placeholder-gray-400"
                style={{ height: "2.5rem", fontSize: "0.95rem" }}
              />
            </div>

            {/* Country Filter */}
            <CustomSelect
              name="country"
              value={selectedCountry?.value || null}
              onChange={setSelectedCountry}
              options={countryOptions}
              placeholder="Select Country"
              isClearable
              isSearchable
              icon={<MapPin className="h-4 w-4" />}
              showIcon
              height="2.5rem"
              fontSize="0.95rem"
            />

            {/* Language Filter */}
            <CustomSelect
              name="language"
              value={selectedLanguage?.value || null}
              onChange={setSelectedLanguage}
              options={languageOptions}
              placeholder="Select Language"
              isClearable
              isSearchable
              icon={<Globe className="h-4 w-4" />}
              showIcon
              height="2.5rem"
              fontSize="0.95rem"
            />

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                variant="orange"
                onClick={handleSearch}
                className="flex-1"
                disabled={loading}
                style={{ height: "2.5rem", fontSize: "0.95rem" }}
              >
                {loading ? "Searching..." : "Search"}
              </Button>
              <Button
                variant="outline"
                onClick={clearFilters}
                disabled={loading}
                style={{ height: "2.5rem", fontSize: "0.95rem" }}
              >
                Clear
              </Button>
            </div>
          </div>

          {/* Active Filters Display */}
          {(selectedCountry || selectedLanguage) && (
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Active filters:
              </span>
              {selectedCountry && (
                <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 text-sm rounded-full">
                  {selectedCountry.value}
                </span>
              )}
              {selectedLanguage && (
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full">
                  {selectedLanguage.value}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <p className="text-red-700 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        )}

        {/* Mentors Grid */}
        {!loading && (
          <>
            {/* Results Count */}
            <div className="mb-6">
              <p className="text-gray-600 dark:text-gray-400">
                {filteredMentors.length === 0
                  ? "No mentors found"
                  : `Found ${filteredMentors.length} mentor${filteredMentors.length !== 1 ? "s" : ""}`}
              </p>
            </div>

            {/* Mentors Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMentors.map((mentor) => (
                <div
                  key={mentor.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden flex flex-col h-full"
                >
                  {/* Card Header */}
                  <div className="p-6 pb-4 flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div className="ml-3">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {mentor.name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {mentor.mentorDetail?.expertise || "Fitness Expert"}
                          </p>
                        </div>
                      </div>
                      {mentor.averageRating !== undefined && mentor.averageRating > 0 && (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-orange-500 text-orange-500" />
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {mentor.averageRating.toFixed(1)}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            ({mentor.totalRatings})
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Location and Language */}
                    <div className="flex items-center gap-4 mb-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {mentor.country}
                      </div>
                      <div className="flex items-center">
                        <Globe className="h-4 w-4 mr-1" />
                        {mentor.language}
                      </div>
                    </div>

                    {/* Bio */}
                    {mentor.mentorDetail?.bio && (
                      <p
                        className="text-sm text-gray-600 dark:text-gray-400 mb-4 overflow-hidden"
                        style={{
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {mentor.mentorDetail.bio}
                      </p>
                    )}

                    {/* Certifications */}
                    {mentor.mentorDetail?.certification && (
                      <div className="mb-4">
                        <h4 className="text-xs font-medium text-gray-900 dark:text-white mb-1">
                          Certifications
                        </h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {mentor.mentorDetail.certification?.map((cert) => (
                            <span key={cert.id} className="block">
                              {cert.title} by {cert.issuer} (
                              {new Date(cert.issue_date).toLocaleDateString()})
                            </span>
                          ))}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Card Footer */}
                  <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700 mt-auto">
                    <div className="flex gap-2">
                      <Button
                        variant="orange"
                        onClick={() => handleBookMentor(mentor.id)}
                        className="flex-1 flex items-center justify-center gap-2"
                      >
                        <Calendar className="h-4 w-4" />
                        Look for a Session
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          /* Handle contact */
                        }}
                        className="flex items-center justify-center"
                      >
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredMentors.length === 0 && !loading && (
              <div className="text-center py-12">
                <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No mentors found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Try adjusting your search criteria or filters
                </p>
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchForMentor;
