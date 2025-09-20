import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";

const EditInternship: React.FC = () => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [skills, setSkills] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchInternship = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/InternshipRoutes/${id}`);
        const data = await res.json();
        setTitle(data.title);
        setDescription(data.description);
        setCompanyName(data.companyName);
        setSkills(data.skills.join(", "));
      } catch (err) {
        console.error("Failed to fetch job:", err);
      }
    };
    if (id) fetchInternship();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/api/InternshipRoutes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          companyName,
          skills: skills.split(",").map(s => s.trim()),
        }),
      });
      if (!res.ok) throw new Error("Failed to update job position");
      navigate("/admin");
    } catch (err) {
      console.error(err);
      alert("Error updating job position");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-start bg-gray-50 py-10">
      <Card className="w-full max-w-lg p-6 shadow-md">
        <h2 className="text-2xl font-bold mb-4">Edit job</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Company Name</label>
            <input
              type="text"
              value={companyName}
              onChange={e => setCompanyName(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              rows={4}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Required Skills (comma-separated)</label>
            <input
              type="text"
              value={skills}
              onChange={e => setSkills(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-purple-600 text-white"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update job"}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default EditInternship;
