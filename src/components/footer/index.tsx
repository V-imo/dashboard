"use client";

import { useTranslations } from "next-intl";
import { Heart, Instagram, Linkedin, Mail } from "lucide-react";
import Link from "next/link";
import { useLocale } from "next-intl";

export default function Footer() {
  const t = useTranslations("Footer");
  const locale = useLocale();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-border/30 bg-background/50 mt-12">
      <div className="w-full max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-foreground">V&apos;imo</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Gérez vos biens immobiliers et inspections en toute simplicité avec notre plateforme complète.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-foreground">Produit</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/property" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">
                  Propriétés
                </Link>
              </li>
              <li>
                <Link href="/inspection" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">
                  Inspections
                </Link>
              </li>
              <li>
                <Link href="/employee" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">
                  Équipe
                </Link>
              </li>
              <li>
                <Link href="/agency" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">
                  Agence
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-foreground">Entreprise</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">
                  À propos
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">
                  Contacter
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">
                  Support
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-foreground">Suivez-nous</h4>
            <div className="flex gap-3">
              <a href="#" className="p-2 rounded-lg bg-muted/30 hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors duration-200">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-muted/30 hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors duration-200">
                <Linkedin className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-muted/30 hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors duration-200">
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="h-px bg-border/30 my-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground text-center sm:text-left">
            © {currentYear} V&apos;imo. Tous droits réservés.
          </p>
          <div className="flex items-center gap-4">
            <Link href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-200">
              Politique de confidentialité
            </Link>
            <div className="h-1 w-1 rounded-full bg-border/50" />
            <Link href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-200">
              Conditions d&apos;utilisation
            </Link>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            Fait avec
            <Heart className="h-3 w-3 text-primary fill-primary" />
            par V&apos;imo
          </div>
        </div>
      </div>
    </footer>
  );
}

