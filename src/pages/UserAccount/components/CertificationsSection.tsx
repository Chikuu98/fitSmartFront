import React, { useState } from "react";
import { Plus, Edit } from "lucide-react";
import type {
  Certification,
  CreateCertificationDto,
  UpdateCertificationDto,
} from "../../../interfaces/user";
import FormInput from "../../../components/ui/formInput";
import { Button } from "../../../components/ui/button";

interface CertificationItemProps {
  certification: Certification;
  isEditing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onUpdate: (data: UpdateCertificationDto) => void;
  updating: boolean;
}

const CertificationItem: React.FC<CertificationItemProps> = ({
  certification,
  isEditing,
  onEdit,
  onCancel,
  onUpdate,
  updating,
}) => {
  const [editData, setEditData] = useState<UpdateCertificationDto>({
    title: certification.title,
    issuer: certification.issuer,
    issue_date: certification.issue_date,
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormInput
            label="Title"
            name="title"
            value={editData.title || ""}
            onChange={(e) =>
              setEditData((prev) => ({ ...prev, title: e.target.value }))
            }
            size="md"
            required
          />
          <FormInput
            label="Issuer"
            name="issuer"
            value={editData.issuer || ""}
            onChange={(e) =>
              setEditData((prev) => ({ ...prev, issuer: e.target.value }))
            }
            size="md"
            required
          />
          <FormInput
            label="Issue Date"
            name="issue_date"
            type="date"
            value={editData.issue_date || ""}
            onChange={(e) =>
              setEditData((prev) => ({ ...prev, issue_date: e.target.value }))
            }
            size="md"
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
    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg flex justify-between items-start">
      <div>
        <h3 className="font-semibold text-gray-900 dark:text-white">
          {certification.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          {certification.issuer}
        </p>
        {certification.issue_date && (
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Issued: {new Date(certification.issue_date).toLocaleDateString()}
          </p>
        )}
      </div>
      <Button onClick={onEdit} variant="default">
        <Edit className="h-4 w-4" />
      </Button>
    </div>
  );
};

interface CertificationsSectionProps {
  certifications: Certification[];
  onAddCertification: (cert: CreateCertificationDto) => void;
  onUpdateCertification: (id: number, cert: UpdateCertificationDto) => void;
  updating: boolean;
}

const CertificationsSection: React.FC<CertificationsSectionProps> = ({
  certifications,
  onAddCertification,
  onUpdateCertification,
  updating,
}) => {
  const [editingCert, setEditingCert] = useState<number | null>(null);
  const [newCert, setNewCert] = useState<CreateCertificationDto>({
    title: "",
    issuer: "",
  });
  const [showAddCert, setShowAddCert] = useState(false);

  const handleAddCertification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCert.title || !newCert.issuer) return;

    onAddCertification(newCert);
    setNewCert({ title: "", issuer: "" });
    setShowAddCert(false);
  };

  const handleUpdateCertification = (
    id: number,
    certData: UpdateCertificationDto,
  ) => {
    onUpdateCertification(id, certData);
    setEditingCert(null);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Certifications
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage your professional certifications
            </p>
          </div>
          <Button onClick={() => setShowAddCert(true)} variant="default">
            <Plus className="h-8 w-8" />
          </Button>
        </div>
      </div>

      <div className="p-6">
        {/* Add new certification form */}
        {showAddCert && (
          <form
            onSubmit={handleAddCertification}
            className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormInput
                label="Title"
                name="title"
                value={newCert.title}
                onChange={(e) =>
                  setNewCert((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
                placeholder="Certification title"
                size="md"
                required
              />
              <FormInput
                label="Issuer"
                name="issuer"
                value={newCert.issuer}
                onChange={(e) =>
                  setNewCert((prev) => ({
                    ...prev,
                    issuer: e.target.value,
                  }))
                }
                placeholder="Issuing organization"
                size="md"
                required
              />
              <FormInput
                label="Issue Date"
                name="issue_date"
                type="date"
                value={newCert.issue_date || ""}
                onChange={(e) =>
                  setNewCert((prev) => ({
                    ...prev,
                    issue_date: e.target.value,
                  }))
                }
                size="md"
              />
            </div>
            <div className="flex space-x-2 mt-4">
              <Button type="submit" variant="true" disabled={updating}>
                {updating ? "Adding..." : "Add"}
              </Button>
              <Button
                type="button"
                onClick={() => {
                  setShowAddCert(false);
                  setNewCert({ title: "", issuer: "" });
                }}
                variant="outline"
                disabled={updating}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}

        {/* Existing certifications */}
        <div className="space-y-4">
          {certifications?.map((cert) => (
            <CertificationItem
              key={cert.id}
              certification={cert}
              isEditing={editingCert === cert.id}
              onEdit={() => setEditingCert(cert.id)}
              onCancel={() => setEditingCert(null)}
              onUpdate={(data) => handleUpdateCertification(cert.id, data)}
              updating={updating}
            />
          ))}

          {!certifications?.length && (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              No certifications added yet. Click "Add Certification" to get
              started.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CertificationsSection;
