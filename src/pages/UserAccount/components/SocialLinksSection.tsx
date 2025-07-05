import React, { useState } from "react";
import { Plus, Edit } from "lucide-react";
import type {
  SocialLink,
  CreateSocialLinkDto,
  UpdateSocialLinkDto,
} from "../../../interfaces/user";
import FormInput from "../../../components/ui/formInput";
import { Button } from "../../../components/ui/button";

interface SocialLinkItemProps {
  socialLink: SocialLink;
  isEditing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onUpdate: (data: UpdateSocialLinkDto) => void;
  updating: boolean;
}

const SocialLinkItem: React.FC<SocialLinkItemProps> = ({
  socialLink,
  isEditing,
  onEdit,
  onCancel,
  onUpdate,
  updating,
}) => {
  const [editData, setEditData] = useState<UpdateSocialLinkDto>({
    platform: socialLink.platform,
    url: socialLink.url,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(editData);
  };

  if (isEditing) {
    return (
      <form
        onSubmit={handleSubmit}
        className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Platform"
            name="platform"
            value={editData.platform || ""}
            onChange={(e) =>
              setEditData((prev) => ({ ...prev, platform: e.target.value }))
            }
            size="md"
            rounded="xl"
            required
          />
          <FormInput
            label="URL"
            name="url"
            type="url"
            value={editData.url || ""}
            onChange={(e) =>
              setEditData((prev) => ({ ...prev, url: e.target.value }))
            }
            size="md"
            rounded="xl"
            required
          />
        </div>
        <div className="flex space-x-2 mt-4">
          <Button type="submit" variant="true" disabled={updating}>
            {updating ? "Saving..." : "Save"}
          </Button>
          <Button
            type="button"
            onClick={onCancel}
            variant="outline"
            disabled={updating}
          >
            Cancel
          </Button>
        </div>
      </form>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg flex justify-between items-center">
      <div>
        <h3 className="font-semibold text-gray-900 dark:text-white">
          {socialLink.platform}
        </h3>
        <a
          href={socialLink.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 dark:text-blue-300 hover:text-blue-600 dark:hover:text-blue-200 text-sm"
        >
          {socialLink.url}
        </a>
      </div>
      <Button onClick={onEdit} variant="default">
        <Edit className="h-4 w-4" />
      </Button>
    </div>
  );
};

interface SocialLinksSectionProps {
  socialLinks: SocialLink[];
  onAddSocialLink: (link: CreateSocialLinkDto) => void;
  onUpdateSocialLink: (id: number, link: UpdateSocialLinkDto) => void;
  updating: boolean;
}

const SocialLinksSection: React.FC<SocialLinksSectionProps> = ({
  socialLinks,
  onAddSocialLink,
  onUpdateSocialLink,
  updating,
}) => {
  const [editingLink, setEditingLink] = useState<number | null>(null);
  const [newLink, setNewLink] = useState<CreateSocialLinkDto>({
    platform: "",
    url: "",
  });
  const [showAddLink, setShowAddLink] = useState(false);

  const handleAddSocialLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLink.platform || !newLink.url) return;

    onAddSocialLink(newLink);
    setNewLink({ platform: "", url: "" });
    setShowAddLink(false);
  };

  const handleUpdateSocialLink = (
    id: number,
    linkData: UpdateSocialLinkDto,
  ) => {
    onUpdateSocialLink(id, linkData);
    setEditingLink(null);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Social Links
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage your social media profiles
            </p>
          </div>
          <Button onClick={() => setShowAddLink(true)} variant="default">
            <Plus className="h-8 w-8" />
          </Button>
        </div>
      </div>

      <div className="p-6">
        {showAddLink && (
          <form
            onSubmit={handleAddSocialLink}
            className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Platform"
                name="platform"
                value={newLink.platform}
                onChange={(e) =>
                  setNewLink((prev) => ({
                    ...prev,
                    platform: e.target.value,
                  }))
                }
                placeholder="e.g., LinkedIn, Instagram"
                size="md"
                required
                rounded="xl"
              />
              <FormInput
                label="URL"
                name="url"
                type="url"
                value={newLink.url}
                onChange={(e) =>
                  setNewLink((prev) => ({ ...prev, url: e.target.value }))
                }
                placeholder="https://..."
                size="md"
                required
                rounded="xl"
              />
            </div>
            <div className="flex space-x-2 mt-4">
              <Button type="submit" variant="true" disabled={updating}>
                {updating ? "Adding..." : "Add"}
              </Button>
              <Button
                type="button"
                onClick={() => {
                  setShowAddLink(false);
                  setNewLink({ platform: "", url: "" });
                }}
                variant="outline"
                disabled={updating}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}

        {/* Existing social links */}
        <div className="space-y-4">
          {socialLinks?.map((link) => (
            <SocialLinkItem
              key={link.id}
              socialLink={link}
              isEditing={editingLink === link.id}
              onEdit={() => setEditingLink(link.id)}
              onCancel={() => setEditingLink(null)}
              onUpdate={(data) => handleUpdateSocialLink(link.id, data)}
              updating={updating}
            />
          ))}

          {!socialLinks?.length && (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              No social links added yet. Click "Add Social Link" to get started.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SocialLinksSection;
