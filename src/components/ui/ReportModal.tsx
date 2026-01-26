import React, { useState } from 'react';
import Modal from './Modal';
import CustomSelect from './customSelect';
import TextAreaInput from './textAreaInput';
import { Button } from './button';
import type {
  ReportType,
  ReportedContentType,
  CreateUserReportPayload,
} from '../../interfaces';
import { createUserReport } from '../../api/endpoints/userReports';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  contentType: ReportedContentType;
  contentId: number;
  contentAuthor: string;
}

const reportTypeOptions = [
  { value: 'harassment' as ReportType, label: 'Harassment or Bullying' },
  { value: 'spam' as ReportType, label: 'Spam or Advertising' },
  { value: 'inappropriate_content' as ReportType, label: 'Inappropriate Content' },
  { value: 'fake_account' as ReportType, label: 'Fake Account' },
  { value: 'other' as ReportType, label: 'Other' },
];

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  contentType,
  contentId,
  contentAuthor,
}) => {
  const [reportType, setReportType] = useState<ReportType | null>(null);
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!reportType || !reason.trim()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const payload: CreateUserReportPayload = {
        report_type: reportType,
        reported_content_type: contentType,
        reported_content_id: contentId,
        reason: reason.trim(),
      };

      await createUserReport(payload);
      
      setReportType(null);
      setReason('');
      setEvidence('');
      onClose();
    } catch (error: any) {
      console.error('Error submitting report:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setReportType(null);
      setReason('');
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Report Content">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          You are reporting content by <span className="font-semibold">{contentAuthor}</span>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Report Reason <span className="text-red-500">*</span>
          </label>
          <CustomSelect
            name="reportType"
            options={reportTypeOptions}
            value={reportType}
            onChange={(option: any) => setReportType(option?.value || null)}
            placeholder="Select a reason"
            isSearchable={false}
          />
        </div>

        <TextAreaInput
          label="Detailed Explanation"
          name="reason"
          value={reason}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setReason(e.target.value)}
          placeholder="Please provide details about why you are reporting this content..."
          rows={4}
          required
        />

        <div className="flex justify-end gap-3 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="red"
            disabled={!reportType || !reason.trim() || isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Report'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
