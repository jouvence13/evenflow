import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';

export default function LoginPage() {
	const navigate = useNavigate();
	const { login, isAuthenticated } = useAuth();

	const [formData, setFormData] = useState({
		email: '',
		password: ''
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

	const handleSubmit = async (event) => {
		event.preventDefault();

		if (!formData.email.trim() || !formData.password.trim()) {
			setError('Veuillez renseigner votre email et votre mot de passe.');
			return;
		}

		try {
			setSubmitting(true);
			setError('');
			await login(formData.email.trim(), formData.password);
			navigate('/', { replace: true });
		} catch (submitError) {
			setError(submitError?.message || 'Échec de connexion. Réessayez.');
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<section className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 py-16 bg-gradient-to-b from-white via-gray-50 to-white fade-in">
			<div className="w-full max-w-md rounded-4xl border border-gray-200 bg-white p-8 sm:p-10 shadow-xl">
				<p className="premium-badge mb-5">Connexion</p>
				<h1 className="text-3xl sm:text-4xl font-black text-dark mb-2">Bon retour sur Evenflow</h1>
				<p className="text-gray-600 mb-8">Connectez-vous pour retrouver vos billets et favoris.</p>

				<form onSubmit={handleSubmit} className="space-y-5" noValidate>
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
						<label htmlFor="password" className="block text-sm font-semibold text-dark mb-2">
							Mot de passe
						</label>
						<input
							id="password"
							name="password"
							type="password"
							autoComplete="current-password"
							className="premium-input"
							placeholder="••••••••"
							value={formData.password}
							onChange={handleChange}
						/>
					</div>

					{error ? (
						<p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p>
					) : null}

					<button type="submit" className="btn-premium w-full justify-center" disabled={submitting}>
						{submitting ? 'Connexion...' : 'Se connecter'}
					</button>
				</form>

				<p className="text-sm text-gray-600 text-center mt-7">
					Pas encore de compte ?{' '}
					<Link to="/register" className="font-bold text-primary hover:text-primary-700">
						Créer un compte
					</Link>
				</p>
			</div>
		</section>
	);
}
