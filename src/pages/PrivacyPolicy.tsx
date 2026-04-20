import { motion } from "motion/react";
import { PageHeader } from "@/components/PageHeader";
import { useDocumentTitle } from "@/lib/useDocumentTitle";

export function PrivacyPolicy() {
  useDocumentTitle("Privacy Policy");

  const sections = [
    {
      title: "Information We Collect",
      content: `When you interact with the African Strikers FC website, we may collect the following types of information:

• Contact form submissions: your name, email address, and message
• Player trial applications: your name, age, email address, phone number, playing position, and experience level
• Newsletter subscriptions: your email address
• Usage data: general analytics such as page visits and session duration (no personally identifiable information)`,
    },
    {
      title: "How We Use Your Information",
      content: `We use the information you provide solely for the following purposes:

• To respond to your enquiries and contact form submissions
• To process and review player trial applications
• To send you club news, match updates, and announcements (newsletter subscribers only)
• To improve the functionality and user experience of our website

We do not sell, trade, or share your personal information with third parties for marketing purposes.`,
    },
    {
      title: "Data Retention",
      content: `We retain your personal information only for as long as necessary to fulfil the purposes for which it was collected. Contact messages and applications are stored securely and reviewed by club staff only. You may request deletion of your data at any time by contacting us at info@africanstrikersfc.com.`,
    },
    {
      title: "Cookies",
      content: `Our website does not use tracking cookies or third-party advertising cookies. We may use essential session cookies to maintain basic website functionality. No personal data is stored in cookies.`,
    },
    {
      title: "Third-Party Services",
      content: `Our website is hosted on Railway. We use standard web infrastructure services. External links (such as social media platforms) are governed by their own privacy policies, over which we have no control.`,
    },
    {
      title: "Your Rights",
      content: `You have the right to:

• Access the personal information we hold about you
• Request correction of inaccurate data
• Request deletion of your personal data
• Withdraw consent for newsletter communications at any time

To exercise any of these rights, contact us at info@africanstrikersfc.com.`,
    },
    {
      title: "Contact",
      content: `If you have any questions about this Privacy Policy or how we handle your data, please contact us:

Email: info@africanstrikersfc.com
Location: Brooklyn Park, Minnesota, USA`,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen pt-24 bg-[#050505]">
      <PageHeader
        badge="Legal"
        title="Privacy Policy"
        subtitle="How African Strikers FC collects, uses, and protects your personal information."
      />

      <section className="py-24 relative">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-slate-400 text-sm mb-12 border-l-2 border-teal-500 pl-4"
          >
            Last updated: April 2026. This policy applies to the African Strikers FC website at africanstrikersfc.com and its Railway-hosted deployment.
          </motion.p>

          <div className="space-y-12">
            {sections.map((section, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
              >
                <h2 className="font-display text-2xl uppercase tracking-wider text-white mb-4">
                  {i + 1}. {section.title}
                </h2>
                <p className="text-slate-400 leading-relaxed whitespace-pre-line text-sm">
                  {section.content}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
