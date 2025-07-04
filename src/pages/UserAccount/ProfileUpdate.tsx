import React, { useState, useEffect } from "react";
import { User } from "lucide-react";
import { UserRole } from "../../enums/userDetailEnums";
import type {
  User as UserType,
  UpdateUserDto,
  UpdateMemberDetailsDto,
  UpdateMentorDetailsDto,
  CreateCertificationDto,
  UpdateCertificationDto,
  CreateSocialLinkDto,
  UpdateSocialLinkDto,
} from "../../interfaces/user";
import {
  getCurrentUser,
  updateUser,
  updateMemberDetails,
  updateMentorDetails,
  addCertification,
  updateCertification,
  addSocialLink,
  updateSocialLink,
} from "../../api/endpoints/users";
import { useConfirmationDialog } from "../../components/ui/confirmationDialog";
import {
  BasicInfoForm,
  MemberDetailsForm,
  MentorDetailsForm,
  CertificationsSection,
  SocialLinksSection,
} from "./components";

const ProfileUpdate: React.FC = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const { openDialog, ConfirmDialog } = useConfirmationDialog();

  const [basicInfo, setBasicInfo] = useState<UpdateUserDto>({});
  const [memberDetails, setMemberDetails] = useState<UpdateMemberDetailsDto>(
    {},
  );
  const [mentorDetails, setMentorDetails] = useState<UpdateMentorDetailsDto>(
    {},
  );

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData);

        setBasicInfo({
          name: userData.name,
          email: userData.email,
          gender: userData.gender,
          country: userData.country,
          language: userData.language,
        });

        if (userData.memberDetail) {
          setMemberDetails(userData.memberDetail);
        }

        if (userData.mentorDetail) {
          setMentorDetails({
            expertise: userData.mentorDetail.expertise,
            bio: userData.mentorDetail.bio,
            contact_number: userData.mentorDetail.contact_number,
          });
        }
      } catch (error) {
        console.error("Failed to load user data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  const reloadUserData = async () => {
    try {
      const userData = await getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error("Failed to reload user data:", error);
    }
  };

  const handleBasicInfoUpdate = () => {
    openDialog({
      title: "Update Profile",
      message:
        "Are you sure you want to update your basic profile information?",
      confirmText: "Update",
      variant: "info",
      onConfirm: async (close) => {
        setUpdating(true);
        try {
          await updateUser(basicInfo);
          await reloadUserData();
          close();
        } catch (error: any) {
          console.error("Failed to update basic info:", error);
        } finally {
          setUpdating(false);
        }
      },
    });
  };

  const handleMemberDetailsUpdate = () => {
    openDialog({
      title: "Update Member Details",
      message: "Are you sure you want to update your member details?",
      confirmText: "Update",
      variant: "info",
      onConfirm: async (close) => {
        setUpdating(true);
        try {
          await updateMemberDetails(memberDetails);
          await reloadUserData();
          close();
        } catch (error: any) {
          console.error("Failed to update member details:", error);
        } finally {
          setUpdating(false);
        }
      },
    });
  };

  const handleMentorDetailsUpdate = () => {
    openDialog({
      title: "Update Mentor Details",
      message: "Are you sure you want to update your mentor details?",
      confirmText: "Update",
      variant: "info",
      onConfirm: async (close) => {
        setUpdating(true);
        try {
          await updateMentorDetails(mentorDetails);
          await reloadUserData();
          close();
        } catch (error: any) {
          console.error("Failed to update mentor details:", error);
        } finally {
          setUpdating(false);
        }
      },
    });
  };

  const handleAddCertification = (newCert: CreateCertificationDto) => {
    openDialog({
      title: "Add Certification",
      message: `Are you sure you want to add the certification "${newCert.title}"?`,
      confirmText: "Add",
      variant: "info",
      onConfirm: async (close) => {
        setUpdating(true);
        try {
          await addCertification(newCert);
          await reloadUserData();
          close();
        } catch (error: any) {
          console.error("Failed to add certification:", error);
        } finally {
          setUpdating(false);
        }
      },
    });
  };

  const handleUpdateCertification = (
    id: number,
    certData: UpdateCertificationDto,
  ) => {
    openDialog({
      title: "Update Certification",
      message: `Are you sure you want to update this certification?`,
      confirmText: "Update",
      variant: "info",
      onConfirm: async (close) => {
        setUpdating(true);
        try {
          await updateCertification(id, certData);
          await reloadUserData();
          close();
        } catch (error: any) {
          console.error("Failed to update certification:", error);
        } finally {
          setUpdating(false);
        }
      },
    });
  };

  const handleAddSocialLink = (newLink: CreateSocialLinkDto) => {
    openDialog({
      title: "Add Social Link",
      message: `Are you sure you want to add the social link for "${newLink.platform}"?`,
      confirmText: "Add",
      variant: "info",
      onConfirm: async (close) => {
        setUpdating(true);
        try {
          await addSocialLink(newLink);
          await reloadUserData();
          close();
        } catch (error: any) {
          console.error("Failed to add social link:", error);
        } finally {
          setUpdating(false);
        }
      },
    });
  };

  const handleUpdateSocialLink = (
    id: number,
    linkData: UpdateSocialLinkDto,
  ) => {
    openDialog({
      title: "Update Social Link",
      message: `Are you sure you want to update this social link?`,
      confirmText: "Update",
      variant: "info",
      onConfirm: async (close) => {
        setUpdating(true);
        try {
          await updateSocialLink(id, linkData);
          await reloadUserData();
          close();
        } catch (error: any) {
          console.error("Failed to update social link:", error);
        } finally {
          setUpdating(false);
        }
      },
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Failed to load profile
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Please try refreshing the page
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <User className="h-6 w-6 text-orange-500" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Profile Settings
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage your account information and preferences
            </p>
          </div>
        </div>

        <BasicInfoForm
          basicInfo={basicInfo}
          onBasicInfoChange={setBasicInfo}
          onSubmit={handleBasicInfoUpdate}
          updating={updating}
        />

        {user.role === UserRole.MEMBER && (
          <MemberDetailsForm
            memberDetails={memberDetails}
            onMemberDetailsChange={setMemberDetails}
            onSubmit={handleMemberDetailsUpdate}
            updating={updating}
          />
        )}

        {user.role === UserRole.MENTOR && (
          <>
            <MentorDetailsForm
              mentorDetails={mentorDetails}
              onMentorDetailsChange={setMentorDetails}
              onSubmit={handleMentorDetailsUpdate}
              updating={updating}
            />

            <CertificationsSection
              certifications={user.mentorDetail?.certification || []}
              onAddCertification={handleAddCertification}
              onUpdateCertification={handleUpdateCertification}
              updating={updating}
            />

            <SocialLinksSection
              socialLinks={user.mentorDetail?.socialLink || []}
              onAddSocialLink={handleAddSocialLink}
              onUpdateSocialLink={handleUpdateSocialLink}
              updating={updating}
            />
          </>
        )}
      </div>

      <ConfirmDialog loading={updating} />
    </>
  );
};

export default ProfileUpdate;
