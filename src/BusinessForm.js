import React, { useState, useEffect } from "react";
import axios from "axios";

function BusinessForm() {
	const [business, setBusiness] = useState({
		name: "",
		description: "",
		branches: [],
		categories: [], // Add categories within business object
	});

	const [categoryOptions, setCategoryOptions] = useState([]);
	const [contactTypeOptions, setcontactTypeOptions] = useState([]);
	const [socialMediaOptions, setsocialMediaOptions] = useState([]);

	const [categoryInput, setCategoryInput] = useState("");
	const [filteredOptions, setFilteredOptions] = useState([]);
	const [showSuggestions, setShowSuggestions] = useState(false);

	// Fetch categories on component mount
	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const response = await axios.get("http://localhost:3000/categories");
				const subcategories = response.data.flatMap((item) =>
					item.DirectorySubcategories.map((sub) => sub.subcategory)
				);
				const uniqueSubcategories = [...new Set(subcategories)];
				setCategoryOptions(uniqueSubcategories);
			} catch (error) {
				console.error("Error fetching categories:", error);
			}
		};
		fetchCategories();
	}, []);

	// Handle input change for category field to filter options
	const handleCategoryChange = (e) => {
		const value = e.target.value;
		setCategoryInput(value);

		// Filter category options based on input and exclude already selected categories
		const filtered = categoryOptions.filter(
			(option) =>
				option.toLowerCase().startsWith(value.toLowerCase()) &&
				!business.categories.includes(option)
		);
		setFilteredOptions(filtered);
		setShowSuggestions(filtered.length > 0);
	};

	// Add selected category to tags
	const handleSuggestionClick = (suggestion) => {
		setBusiness((prev) => ({
			...prev,
			categories: [...prev.categories, suggestion],
		}));
		setCategoryInput("");
		setShowSuggestions(false);
	};

	// Remove a category tag
	const removeCategory = (categoryToRemove) => {
		setBusiness((prev) => ({
			...prev,
			categories: prev.categories.filter(
				(category) => category !== categoryToRemove
			),
		}));
	};

	// Handle input change for business information fields
	const handleBusinessChange = (e) => {
		const { name, value } = e.target;
		setBusiness((prev) => ({ ...prev, [name]: value }));
	};

	// Add new branch with empty fields
	const addBranch = () => {
		setBusiness((prev) => ({
			...prev,
			branches: [
				...prev.branches,
				{ name: "", address: "", contacts: [], socialLinks: [] },
			],
		}));
	};

	// Handle branch data changes
	const handleBranchChange = (index, e) => {
		const { name, value } = e.target;
		const updatedBranches = [...business.branches];
		updatedBranches[index][name] = value;
		setBusiness((prev) => ({ ...prev, branches: updatedBranches }));
	};

	// Add a new contact to a specific branch
	const addContact = (branchIndex) => {
		const updatedBranches = [...business.branches];
		updatedBranches[branchIndex].contacts.push({ type: "", info: "" });
		setBusiness((prev) => ({ ...prev, branches: updatedBranches }));
	};

	// Handle contact information changes
	const handleContactChange = (branchIndex, contactIndex, e) => {
		const { name, value } = e.target;
		const updatedBranches = [...business.branches];
		updatedBranches[branchIndex].contacts[contactIndex][name] = value;
		setBusiness((prev) => ({ ...prev, branches: updatedBranches }));
	};

	// Add a new social link to a specific branch
	const addSocialLink = (branchIndex) => {
		const updatedBranches = [...business.branches];
		updatedBranches[branchIndex].socialLinks.push({ platform: "", info: "" });
		setBusiness((prev) => ({ ...prev, branches: updatedBranches }));
	};

	// Handle social link information changes
	const handleSocialLinkChange = (branchIndex, socialIndex, e) => {
		const { name, value } = e.target;
		const updatedBranches = [...business.branches];
		updatedBranches[branchIndex].socialLinks[socialIndex][name] = value;
		setBusiness((prev) => ({ ...prev, branches: updatedBranches }));
	};

	// Submit form data
	const handleSubmit = (e) => {
		e.preventDefault();
		console.log("Business Info:", business);
	};

	return (
		<form onSubmit={handleSubmit}>
			<h2>Business Information</h2>

			<label>
				Business Name:
				<input
					type="text"
					name="name"
					value={business.name}
					onChange={handleBusinessChange}
					required
				/>
			</label>
			<br />

			<label>
				Description:
				<textarea
					name="description"
					value={business.description}
					onChange={handleBusinessChange}
					required
				/>
			</label>
			<br />

			<label>
				Categories:
				<input
					type="text"
					value={categoryInput}
					onChange={handleCategoryChange}
					onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
					onFocus={() => setShowSuggestions(filteredOptions.length > 0)}
					placeholder="Start typing..."
				/>
			</label>

			{showSuggestions && (
				<ul className="suggestions">
					{filteredOptions.map((option, index) => (
						<li key={index} onClick={() => handleSuggestionClick(option)}>
							{option}
						</li>
					))}
				</ul>
			)}

			<div className="tags-container">
				{business.categories.map((category, index) => (
					<div key={index} className="tag">
						{category}
						<button type="button" onClick={() => removeCategory(category)}>
							x
						</button>
					</div>
				))}
			</div>

			<h3>Branches</h3>
			{business.branches.map((branch, branchIndex) => (
				<div key={branchIndex} style={{ marginBottom: "20px" }}>
					<h4>Branch {branchIndex + 1}</h4>

					<label>
						Branch Name:
						<input
							type="text"
							name="name"
							value={branch.name}
							onChange={(e) => handleBranchChange(branchIndex, e)}
							required
						/>
					</label>
					<br />

					<label>
						Address:
						<input
							type="text"
							name="address"
							value={branch.address}
							onChange={(e) => handleBranchChange(branchIndex, e)}
							required
						/>
					</label>
					<br />

					<h5>Contacts</h5>
					{branch.contacts.map((contact, contactIndex) => (
						<div key={contactIndex} style={{ marginLeft: "20px" }}>
							<label>
								Type:
								<select
									name="type"
									value={contact.type}
									onChange={(e) =>
										handleContactChange(branchIndex, contactIndex, e)
									}
									required
								>
									<option value="">Select Type</option>
									<option value="phone">Phone</option>
									<option value="email">Email</option>
									<option value="fax">Fax</option>
								</select>
							</label>

							<label>
								Contact Info:
								<input
									type="text"
									name="info"
									value={contact.info}
									onChange={(e) =>
										handleContactChange(branchIndex, contactIndex, e)
									}
									required
								/>
							</label>
						</div>
					))}
					<button type="button" onClick={() => addContact(branchIndex)}>
						+ Add Contact
					</button>

					<h5>Social Links</h5>
					{branch.socialLinks.map((social, socialIndex) => (
						<div key={socialIndex} style={{ marginLeft: "20px" }}>
							<label>
								Social Media:
								<select
									name="platform"
									value={social.platform}
									onChange={(e) =>
										handleSocialLinkChange(branchIndex, socialIndex, e)
									}
									required
								>
									<option value="">Select Platform</option>
									<option value="facebook">Facebook</option>
									<option value="twitter">Twitter</option>
									<option value="linkedin">LinkedIn</option>
								</select>
							</label>

							<label>
								Social Media Info:
								<input
									type="text"
									name="info"
									value={social.info}
									onChange={(e) =>
										handleSocialLinkChange(branchIndex, socialIndex, e)
									}
									required
								/>
							</label>
						</div>
					))}
					<button type="button" onClick={() => addSocialLink(branchIndex)}>
						+ Add Social Link
					</button>
				</div>
			))}

			<button type="button" onClick={addBranch}>
				+ Add Branch
			</button>

			<br />
			<button type="submit">Submit</button>
		</form>
	);
}

export default BusinessForm;
