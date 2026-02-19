import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';

export default function RegisterPage() {
	const navigate = useNavigate();
	const { register, isAuthenticated } = useAuth();

	const [formData, setFormData] = useState({
		name: '',
		email: '',
		password: '',
		confirmPassword: '',
		role: 'BUYER'
	});
	const [error, setError] = useState('');
	const [submitting, setSubmitting] = useState(false);

	if (isAuthenticated) {
		return <Navigate to="/" replace />;
	}

	const handleChange = (event) => {
		const { name, value } = event.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
		if (error) setError('');
	};

	const validate = () => {
		if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
			return 'Tous les champs sont obligatoires.';
		}

		if (formData.password.length < 6) {
			return 'Le mot de passe doit contenir au moins 6 caractères.';
		}

		if (formData.password !== formData.confirmPassword) {
			return 'Les mots de passe ne correspondent pas.';
		}

		return '';
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		const validationError = validate();

		if (validationError) {
			setError(validationError);
			return;
		}

		try {
			setSubmitting(true);
			setError('');
			await register({
				name: formData.name.trim(),
				email: formData.email.trim(),
				password: formData.password,
				role: formData.role
			});
			navigate('/dashboard', { replace: true });
		} catch (submitError) {
			setError(submitError?.response?.data?.message || submitError?.message || 'Échec de création du compte. Réessayez.');
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<section className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 py-16 bg-gradient-to-b from-white via-gray-50 to-white fade-in">
			<div className="w-full max-w-lg rounded-4xl border border-gray-200 bg-white p-8 sm:p-10 shadow-xl">
				<p className="premium-badge mb-5">Inscription</p>
				<h1 className="text-3xl sm:text-4xl font-black text-dark mb-2">Créez votre compte</h1>
				<p className="text-gray-600 mb-8">Rejoignez Evenflow pour réserver vos prochains événements.</p>

				<form onSubmit={handleSubmit} className="space-y-5" noValidate>
					<div>
						<label htmlFor="name" className="block text-sm font-semibold text-dark mb-2">
							Nom complet
						</label>
						<input
							id="name"
							name="name"
							type="text"
							autoComplete="name"
							className="premium-input"
							placeholder="Ex: Sarah Dupont"
							value={formData.name}
							onChange={handleChange}
						/>
					</div>

					<div>
						<label htmlFor="email" className="block text-sm font-semibold text-dark mb-2">
							Email
						</label>
						<input
							id="email"
							name="email"
							type="email"
							autoComplete="email"
							className="premium-input"
							placeholder="vous@exemple.com"
							value={formData.email}
							onChange={handleChange}
						/>
					</div>

					<div>
						<label htmlFor="role" className="block text-sm font-semibold text-dark mb-2">
							Type de compte
						</label>
						<select
							id="role"
							name="role"
							className="premium-input"
							value={formData.role}
							onChange={handleChange}
						>
							<option value="BUYER">Acheteur</option>
							<option value="ORGANIZER">Organisateur</option>
						</select>
					</div>

					<div>
						<label htmlFor="password" className="block text-sm font-semibold text-dark mb-2">
							Mot de passe
						</label>
						<input
							id="password"
							name="password"
							type="password"
							autoComplete="new-password"
							className="premium-input"
							placeholder="Minimum 6 caractères"
							value={formData.password}
							onChange={handleChange}
						/>
					</div>

					<div>
						<label htmlFor="confirmPassword" className="block text-sm font-semibold text-dark mb-2">
							Confirmer le mot de passe
						</label>
						<input
							id="confirmPassword"
							name="confirmPassword"
							type="password"
							autoComplete="new-password"
							className="premium-input"
							placeholder="Répétez le mot de passe"
							value={formData.confirmPassword}
							onChange={handleChange}
						/>
					</div>

					{error ? (
						<p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p>
					) : null}

					<button type="submit" className="btn-premium w-full justify-center" disabled={submitting}>
						{submitting ? 'Création...' : 'Créer mon compte'}
					</button>
				</form>

				<p className="text-sm text-gray-600 text-center mt-7">
					Déjà inscrit ?{' '}
					<Link to="/login" className="font-bold text-primary hover:text-primary-700">
						Se connecter
					</Link>
				</p>
			</div>
		</section>
	);
}
