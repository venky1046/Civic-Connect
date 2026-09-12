import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LocateFixed, Send, Users, CheckCircle2 } from 'lucide-react';
import UserLayout from '../layouts/UserLayout';
import ImageUploader from '../components/ImageUploader';
import Modal from '../components/Modal';
import PriorityBadge from '../components/PriorityBadge';
import { getCategories, submitComplaint, supportComplaint } from '../services/complaintService';
import { useToast } from '../hooks/useToast';

const initialForm = {
  category: '',
  title: '',
  description: '',
  location: '',
  latitude: '',
  longitude: '',
};

export default function ReportIssue() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [image, setImage] = useState(null);
  const [imageError, setImageError] = useState(null);
  const [errors, setErrors] = useState({});
  const [locating, setLocating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [duplicate, setDuplicate] = useState(null);
  const [success, setSuccess] = useState(null);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    getCategories().then(setCategories).catch(() => {});
  }, []);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser.');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((f) => ({
          ...f,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          location: f.location || `Lat ${pos.coords.latitude.toFixed(5)}, Lng ${pos.coords.longitude.toFixed(5)}`,
        }));
        setLocating(false);
      },
      () => {
        toast.error('Unable to fetch your location. Please enter it manually.');
        setLocating(false);
      }
    );
  };

  const validate = () => {
    const errs = {};
    if (!form.category) errs.category = 'Please select an issue category.';
    if (!form.title.trim()) errs.title = 'Please provide an issue title.';
    if (!form.description.trim()) errs.description = 'Please describe the problem.';
    if (!form.location.trim()) errs.location = 'Please provide the issue location.';
    if (!image) errs.image = 'Please upload an image of the problem.';
    return errs;
  };

  const buildFormData = (forceSeparate) => {
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    fd.append('image', image);
    if (forceSeparate) fd.append('forceSeparate', 'true');
    return fd;
  };

  const doSubmit = async (forceSeparate = false) => {
    setSubmitting(true);
    try {
      const data = await submitComplaint(buildFormData(forceSeparate));
      if (data.duplicate) {
        setDuplicate(data.existing);
      } else {
        setSuccess(data.complaint);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Unable to submit complaint. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    doSubmit(false);
  };

  const handleSupportExisting = async () => {
    setSubmitting(true);
    try {
      await supportComplaint(duplicate.complaintId);
      toast.success('Thank you for supporting this issue.');
      navigate(`/track?id=${duplicate.complaintId}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Unable to support this issue.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitSeparate = () => {
    setDuplicate(null);
    doSubmit(true);
  };

  if (success) {
    return (
      <UserLayout>
        <div className="max-w-lg mx-auto card p-8 text-center mt-10">
          <div className="w-14 h-14 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={28} />
          </div>
          <h2 className="text-xl font-semibold text-navy-800">Complaint Submitted Successfully!</h2>
          <p className="text-sm text-ink-500 mt-2">Your complaint ID is</p>
          <p className="text-2xl font-display font-semibold text-navy-800 mt-1 tracking-wide">
            {success.complaintId}
          </p>
          <div className="flex gap-3 justify-center mt-7">
            <button className="btn-secondary" onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </button>
            <button className="btn-primary" onClick={() => navigate(`/track?id=${success.complaintId}`)}>
              Track Complaint
            </button>
          </div>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-semibold">Report a Civic Issue</h1>
        <p className="text-sm text-ink-500 mt-1">
          Give us the details and we'll route it to the right department.
        </p>

        <form onSubmit={handleSubmit} className="card p-6 sm:p-8 mt-6 flex flex-col gap-5" noValidate>
          <Field label="Issue Category" error={errors.category}>
            <select className="input-field" value={form.category} onChange={update('category')}>
              <option value="">Select a category</option>
              {categories.map((c) => (
                <option key={c.key} value={c.label}>
                  {c.label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Issue Title" error={errors.title}>
            <input
              className="input-field"
              value={form.title}
              onChange={update('title')}
              placeholder="e.g. Large pothole near bus stop"
            />
          </Field>

          <Field label="Problem Description" error={errors.description}>
            <textarea
              className="input-field min-h-[110px] resize-y"
              value={form.description}
              onChange={update('description')}
              placeholder="Describe what you observed, how long it's been there, and any safety concerns."
            />
          </Field>

          <Field label="Location" error={errors.location}>
            <div className="flex gap-2">
              <input
                className="input-field"
                value={form.location}
                onChange={update('location')}
                placeholder="Street, area, landmark"
              />
              <button
                type="button"
                onClick={useMyLocation}
                className="btn-secondary shrink-0 px-3.5"
                disabled={locating}
                title="Use my current location"
              >
                <LocateFixed size={16} />
              </button>
            </div>
            {form.latitude && (
              <p className="text-xs text-ink-400 mt-1">
                Location pinned: {Number(form.latitude).toFixed(5)}, {Number(form.longitude).toFixed(5)}
              </p>
            )}
          </Field>

          <Field label="Upload Problem Image" error={errors.image || imageError}>
            <ImageUploader
              file={image}
              error={imageError}
              onChange={(file, err) => {
                setImage(file);
                setImageError(err);
              }}
            />
          </Field>

          <button type="submit" className="btn-primary mt-2" disabled={submitting}>
            <Send size={16} /> {submitting ? 'Submitting...' : 'Submit Complaint'}
          </button>
        </form>
      </div>

      <Modal
        open={!!duplicate}
        onClose={() => setDuplicate(null)}
        title="This issue has already been reported"
        footer={
          <>
            <button className="btn-secondary" onClick={handleSubmitSeparate} disabled={submitting}>
              Submit as Separate Issue
            </button>
            <button className="btn-primary" onClick={handleSupportExisting} disabled={submitting}>
              Support This Issue
            </button>
          </>
        }
      >
        {duplicate && (
          <div className="flex flex-col gap-3">
            <p className="text-sm text-ink-500">
              Other citizens have already reported a similar issue nearby. You can add your support
              instead of creating a duplicate report.
            </p>
            <div className="rounded-lg bg-navy-50 p-4">
              <p className="text-xs font-mono text-ink-500">{duplicate.complaintId}</p>
              <p className="font-semibold text-navy-800 mt-0.5">{duplicate.title}</p>
              <p className="text-sm text-ink-500 mt-1">{duplicate.location}</p>
              <div className="flex items-center justify-between mt-3">
                <span className="flex items-center gap-1.5 text-sm font-medium text-navy-700">
                  <Users size={15} /> {duplicate.communityCount} citizens reported this issue
                </span>
                <PriorityBadge priority={duplicate.priority} />
              </div>
            </div>
          </div>
        )}
      </Modal>
    </UserLayout>
  );
}

function Field({ label, error, children }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-navy-800 mb-1.5">{label}</span>
      {children}
      {error && <span className="block text-xs text-red-600 mt-1">{error}</span>}
    </label>
  );
}
