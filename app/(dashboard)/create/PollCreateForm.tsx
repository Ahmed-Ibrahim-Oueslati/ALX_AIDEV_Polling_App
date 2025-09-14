"use client";

import { useState } from "react";
import { createPoll } from "@/app/lib/actions/poll-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * @component PollCreateForm
 * @description A form for creating a new poll. It allows users to input a question and multiple options.
 * The form handles state for options, errors, and success messages, and calls a server action to create the poll.
 * @returns {JSX.Element} The poll creation form component.
 */
export default function PollCreateForm() {
  // State for poll options, initialized with two empty strings.
  const [options, setOptions] = useState(["", ""]);
  // State for storing error messages from the server action.
  const [error, setError] = useState<string | null>(null);
  // State to indicate successful poll creation.
  const [success, setSuccess] = useState(false);

  /**
   * @function handleOptionChange
   * @description Updates the value of a specific poll option.
   * @param {number} idx - The index of the option to update.
   * @param {string} value - The new value for the option.
   */
  const handleOptionChange = (idx: number, value: string) => {
    setOptions((opts) => opts.map((opt, i) => (i === idx ? value : opt)));
  };

  /**
   * @function addOption
   * @description Adds a new empty option to the poll.
   */
  const addOption = () => setOptions((opts) => [...opts, ""]);

  /**
   * @function removeOption
   * @description Removes a poll option, ensuring at least two options remain.
   * @param {number} idx - The index of the option to remove.
   */
  const removeOption = (idx: number) => {
    if (options.length > 2) {
      setOptions((opts) => opts.filter((_, i) => i !== idx));
    }
  };

  return (
    <form
      action={async (formData) => {
        // Reset error and success states before submitting.
        setError(null);
        setSuccess(false);
        // Call the server action to create the poll.
        const res = await createPoll(formData);
        if (res?.error) {
          // Set error message if the action returns an error.
          setError(res.error);
        } else {
          // Set success state and redirect after a short delay.
          setSuccess(true);
          setTimeout(() => {
            window.location.href = "/polls";
          }, 1200);
        }
      }}
      className="space-y-6 max-w-md mx-auto"
    >
      <div>
        <Label htmlFor="question">Poll Question</Label>
        <Input name="question" id="question" required />
      </div>
      <div>
        <Label>Options</Label>
        {options.map((opt, idx) => (
          <div key={idx} className="flex items-center gap-2 mb-2">
            <Input
              name="options"
              value={opt}
              onChange={(e) => handleOptionChange(idx, e.target.value)}
              required
            />
            {/* Only show remove button if there are more than two options. */}
            {options.length > 2 && (
              <Button type="button" variant="destructive" onClick={() => removeOption(idx)}>
                Remove
              </Button>
            )}
          </div>
        ))}
        <Button type="button" onClick={addOption} variant="secondary">
          Add Option
        </Button>
      </div>
      {/* Display error message if there is one. */}
      {error && <div className="text-red-500">{error}</div>}
      {/* Display success message upon successful creation. */}
      {success && <div className="text-green-600">Poll created! Redirecting...</div>}
      <Button type="submit">Create Poll</Button>
    </form>
  );
} 